// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "markdown-autolinefeed" is now active!');

    let autoLineFeed = vscode.commands.registerCommand('extension.AutoLineFeed', function () {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        let lineCount = editor.document.lineCount;
        editor.edit((editBuilder) => {
            for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
                let lineText = editor.document.lineAt(lineIndex).text;
                if (/(\S|(\S ))$/g.test(lineText)) {
                    editBuilder.insert(new vscode.Position(lineIndex, lineText.length), (RegExp.$1.length == 1?'  ':' '));
                }
            }

        });
    });

    context.subscriptions.push(autoLineFeed);


    let autoSpace = vscode.commands.registerCommand('extension.AutoSpace', function () {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        let lineCount = editor.document.lineCount;
        editor.edit((editBuilder) => {

            let ignoring = false;
            for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
                let lineText = editor.document.lineAt(lineIndex).text;
                
                if (/^(\s{0,3}```)/g.test(lineText)) {
                    ignoring = !ignoring;
                    continue;
                }
                if(ignoring) continue;


                let newLineText = '';
                newLineText = lineText.replace(/(( ){2,})\S/g, function(){
                    let match = arguments[0];
                    let firstGroupData = arguments[1];
                    let newGroupData = ' ';

                    for (let index = 1; index < firstGroupData.length; index++) {
                        newGroupData += '&nbsp;';                        
                    }

                    match = match.replace(firstGroupData,newGroupData);

                    return match;
                });

                editBuilder.replace(new vscode.Range(new vscode.Position(lineIndex, 0),
                                                     new vscode.Position(lineIndex, lineText.length)
                                                    ), 
                                    newLineText);
            }

        });
    });

    context.subscriptions.push(autoSpace);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;