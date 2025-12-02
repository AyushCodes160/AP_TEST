import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import { ACTIONS } from "../Actions";

function Editor({ socketRef, roomId, onCodeChange, editorRef: externalEditorRef }) {
  const editorRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          indentUnit: 4,
          smartIndent: true,
          indentWithTabs: false,
          electricChars: true,
          matchBrackets: true,
          tabSize: 4,
          lineWrapping: true,
        }
      );
      
      editor.setOption("extraKeys", {
        "Enter": function(cm) {
          const cursor = cm.getCursor();
          const line = cm.getLine(cursor.line);
          
          const indentMatch = line.match(/^(\s*)/);
          const currentIndent = indentMatch ? indentMatch[1].length : 0;
          const indentUnit = cm.getOption("indentUnit");
          
          const shouldIncreaseIndent = /:\s*$/.test(line) || /{\s*$/.test(line);
          
          if (shouldIncreaseIndent) {
            cm.replaceSelection("\n");
            const newIndent = currentIndent + indentUnit;
            const spaces = " ".repeat(newIndent);
            cm.replaceSelection(spaces);
          } else {
            cm.replaceSelection("\n");
            const spaces = " ".repeat(currentIndent);
            cm.replaceSelection(spaces);
          }
        },
        "Tab": function(cm) {
          if (cm.somethingSelected()) {
            cm.indentSelection("add");
          } else {
            const spaces = " ".repeat(cm.getOption("indentUnit"));
            cm.replaceSelection(spaces);
          }
        },
        "Shift-Tab": function(cm) {
          cm.indentSelection("subtract");
        }
      });
      editorRef.current = editor;
      
      if (externalEditorRef) {
        externalEditorRef.current = editor;
      }

      editor.setSize(null, "100%");
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    };

    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && editorRef.current) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      if (socketRef.current) {
        try {
          socketRef.current.off(ACTIONS.CODE_CHANGE);
        } catch (error) {
          console.error("Error cleaning up socket listener:", error);
        }
      }
    };
  }, [socketRef.current]);

  return (
    <div style={{ height: "600px" }}>
      <textarea id="realtimeEditor"></textarea>
    </div>
  );
}

export default Editor;
