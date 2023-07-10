import { basicSetup, EditorView } from "codemirror";
import {indentWithTab, insertTab, indentLess} from "@codemirror/commands"
import {keymap} from '@codemirror/view'
import {EditorState} from "@codemirror/state"
import {SearchQuery} from "@codemirror/search"

let sync_val = ""

let editor = new EditorView({
    state: EditorState.create({
        doc : 'Write your code here (the line of number must be greater than 1 to run the code)',
        extensions: [basicSetup, keymap.of([{
            key: 'Tab',
            preventDefault: true,
            run: insertTab
        },{
            key: 'Shift-Tab',
            preventDefault: true,
            run: indentLess
        }]), 
            EditorView.theme({
                "&": {height: "500px"},
                ".cm-scroller": {overflow: "auto"}
            }),
            EditorView.updateListener.of(function(e){
                sync_val = e.state.doc.toString()
            })
        ],
    }),
    parent: document.querySelector('#editor')
})

