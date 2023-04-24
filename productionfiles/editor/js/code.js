let temp = false
let code = ""
let predict_lang = ""
let lang_array = ['java', 'py', 'cpp', 'cs', 'js']
let lang_comp = ""
let input = ""

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
        }
    })
}

// compile and run the code
function runCode() {
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
            },
            error: function(error){
                console.log('Something went wrong! ', error)
            }
        })

        //show predict lang
        $('#predict_lang').html('Your Programming Language is: ' + predict_lang)
    }
}

// create new page --> duplicate tabs
function newPage(){
    window.open('http://127.0.0.1:8000')
}
