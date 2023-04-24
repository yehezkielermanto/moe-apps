let temp = false
let code = ""
let predict_lang = ""
let lang_array = ['java', 'py', 'cpp', 'cs', 'js']
let lang_comp = ""
let input = ""
let state = false
let state_download = false
let btn_runCode = document.getElementById('run_code')
let btn_downloadCode = document.getElementById('download_code')

// function to get code from code editor
function getCode() {
    if (temp == false) {
        let editor = document.getElementsByClassName('cm-content')
        // console.log(editor[0])
        code = editor[0].innerText
        // console.log(editor[0].innerText);
        let number = document.getElementsByClassName('cm-gutters')
        let value = parseInt(number[0].children[0].lastChild.innerText)
        // console.log(value)
        
        if (value >= 11) {
            // check value is empty or not
            // call prediction function
            prediction()
            if (predict_lang == 'Java') {
                lang_comp = lang_array[0]
            } else if (predict_lang == 'Python') {
                lang_comp = lang_array[1]
            } else if (predict_lang == 'C++') {
                lang_comp = lang_array[2]
            } else if (predict_lang == 'C#') {
                lang_comp = lang_array[3]
            } else if (predict_lang == 'JavaScript') {
                lang_comp = lang_array[4]
            }
            // temp = true
            state = true
            btn_runCode.classList.remove("disabled:opacity-75")
            btn_runCode.disabled = false
        }else{
            state = false
            state_download = false
            btn_runCode.classList.add("disabled:opacity-75")
            btn_downloadCode.classList.add("disabled:opacity-75")
            
            btn_downloadCode.disabled = true
            btn_runCode.disabled = true
        }
    }
}

// function to prediction
function prediction() {
    // console.log("waktunya klasifikasi")
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
    $.ajax({
        url: 'editor/predict',
        type: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        },
        data: {'code': code},
        success: function(response) {
            predict_lang = response
            //show predict lang
            $('#predict_lang').html('Your Programming Language is: ' + predict_lang)
        }
    })
}

// compile and run the code
function runCode() {
    if(state != false){
        // console.log(predict_lang, lang_comp)
        // get input from from
        let temp = $("#input_code").val()
        if(temp != ""){
            input = temp
        }
        // ajax send to api compiler
        if (lang_comp != "") {
            let data = ({
            'code': code,
            'language': lang_comp,
            'input': input
            })
    
            // ajax to compile and run the code
            $.ajax({
                // alternate url from jaagrav
                // url: 'https://api.codex.jaagrav.in',
    
                // alternate url from railway
                // url: 'https://codex-api-production-e4c9.up.railway.app',
                
                // url from codesandbox
                url: 'https://rzrk5p-3000.csb.app/',
                type: 'POST',
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function(response) {
                    // console.log(response)
                    let output = response.output
                    let error = response.error
                    // console.log(response.output)
                    // console.log(response.error)
    
                    $("#result").html(output)
                    if(error != ""){
                        $("#result").html(error)
                    }

                    state_download = true
                    btn_downloadCode.classList.remove("disabled:opacity-75")
                    btn_downloadCode.disabled = false
                },
                error: function(error){
                    console.log('Something went wrong! ', error)
                }
            })
        }
    }
}

// create new page --> duplicate tabs
function newPage(){
    window.open('http://127.0.0.1:8000')
}

// download code
function downloadCode(){
    if (state_download != false && code.trim().length != 0){
        let blob = new Blob([code], {
            type: "text/plain;charset=utf-8"
        })
    
    
        // make download link 
        const fileUrl = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.download = `code.${lang_comp}`
        link.href = fileUrl
        link.click()
    }
}


function clearOutput(){
    $("#result").html("")
}