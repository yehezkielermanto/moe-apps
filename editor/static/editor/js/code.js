let temp = false;
let code = "";
let predict_lang = null;
let lang_array = ["java", "py", "cpp", "cs", "js"];
let lang_comp = null;
let input = "";
let state = false;
let state_download = false;
let btn_runCode = document.getElementById("run_code");
let btn_downloadCode = document.getElementById("download_code");
let icon_run = document.getElementById("icon_run");
let icon_spin = document.getElementById("icon_spin");
let alert_failed = document.getElementById("alert_failed");

// function to get code from code editor
function getCode() {
  if (temp == false) {
    let editor = document.getElementsByClassName("cm-content");
    // console.log(editor[0])
    code = editor[0].innerText;
    // console.log(editor[0].innerText);
    let number = document.getElementsByClassName("cm-gutters");
    let value = parseInt(number[0].children[0].lastChild.innerText);
    // console.log(value)

    if (value > 9 && code.trim().length != 0) {
      // check value is empty or not
      // call prediction function
      prediction();
      if (predict_lang == "Java") {
        lang_comp = lang_array[0];
      } else if (predict_lang == "Python") {
        lang_comp = lang_array[1];
      } else if (predict_lang == "C++") {
        lang_comp = lang_array[2];
      } else if (predict_lang == "C#") {
        lang_comp = lang_array[3];
      } else if (predict_lang == "JavaScript") {
        lang_comp = lang_array[4];
      }
      // temp = true
      state = true;
      btn_runCode.classList.remove("disabled:opacity-75");
      btn_runCode.disabled = false;
    } else {
      state = false;
      state_download = false;
      btn_runCode.classList.add("disabled:opacity-75");
      btn_downloadCode.classList.add("disabled:opacity-75");

      btn_downloadCode.disabled = true;
      btn_runCode.disabled = true;
    }
  }
}

// function to prediction
function prediction() {
  // console.log("waktunya klasifikasi")
  const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
  $.ajax({
    url: "editor/predict",
    type: "POST",
    headers: {
      "X-CSRFToken": csrftoken,
    },
    data: { code: code },
    success: function (response) {
      predict_lang = response;
      //show predict lang
      $("#predict_lang").html("Your Programming Language is: " + predict_lang);
    },
  });
}

// compile and run the code
function runCode() {
  if (state != false) {
    icon_spin.classList.remove("hidden");
    icon_run.classList.add("hidden");

    // console.log(predict_lang, lang_comp)
    // get input from from
    let temp = $("#input_code").val();
    if (temp != "") {
      input = temp;
    }

    // ajax send to api compiler
    if (lang_comp != null) {
      let data = {
        code: code,
        language: lang_comp,
      };
      // ajax to compile and run the code
      $.ajax({
        // alternate url from jaagrav
        // url: 'https://api.codex.jaagrav.in',

        // alternate url from railway
        // url: 'https://codex-api-production-e4c9.up.railway.app',

        // url code sandbox
        // url: "https://lyb8kt-3000.csb.app/",
        url: "http://192.168.1.10:3000/",
        type: "POST",
        data: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success: function (response) {
          console.log(response)
          $.ajax({
                url: 'http://192.168.1.10:8080/execute',
                type: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: {
                    commands: response.command.executeCodeCommand,
                    filePath: response.command.executionArgs[0]
                },
                success: function(response){
                    // console.log(response)
                    var ws = new WebSocket('ws://192.168.1.10:8080/')
                    term.clear()
                    ws.addEventListener('open', () => {
                        attach.attach(term, ws)
                    });
                    
                    // ws.onmessage = function(event){
                    //     console.log(event.data)
                    // }

                    ws.addEventListener('message', function (event) {  
                      // console.log(event.data)            
                        // ws.send(event.data)
                    });
                    
                    // ws.close(1000, 'work complete')
                    ws.addEventListener('close', () => {
                      console.log('connection closed')
                      // new WebSocket('ws://192.168.10.219:8080/')
                    })
                }
            })
          
          // send to node app to compile program
          // $.ajax({
          //   url: 'http://192.168.1.10:3000/run',
          //   type: "GET",
          //   headers: {
          //     "Content-Type": "application/x-www-form-urlencoded",
          //   },
          // })
          // connection to web socket
          // var ws = new WebSocket('ws://192.168.1.10:8000/')
          // ws.addEventListener('open', function(event){
          //   const message = {
          //     command: response.command.executeCodeCommand,
          //     argument: response.command.executionArgs[0]
          //   }
            
          //   // send JSON message to web socket
          //   ws.send(JSON.stringify(message))
          //   console.log('Connection open')
          // })

          let output = "";
          let error = "";
          // console.log(response.output)
          // console.log(response.error)

          // remove alert
          alert_failed.classList.remove("flex");
          alert_failed.classList.add("hidden");

          $("#result").html(output);
          if (error != "") {
            $("#result").html(error);
          }

          state_download = true;
          btn_downloadCode.classList.remove("disabled:opacity-75");
          btn_downloadCode.disabled = false;

          icon_spin.classList.add("hidden");
          icon_run.classList.remove("hidden");
        },
        error: function (error) {
          alert_failed.classList.remove("hidden");
          alert_failed.classList.add("flex");

          icon_spin.classList.add("hidden");
          icon_run.classList.remove("hidden");
        },
      });
    } else {
      alert_failed.classList.remove("hidden");
      alert_failed.classList.add("flex");

      icon_spin.classList.add("hidden");
      icon_run.classList.remove("hidden");
    }
  }
}

// create new page --> duplicate tabs
function newPage() {
  // window.open("https://03bmoc-8000.csb.app");
  window.open("http://127.0.0.1/");
}

// download code
function downloadCode() {
  if (state_download != false && code.trim().length != 0) {
    let blob = new Blob([code], {
      type: "text/plain;charset=utf-8",
    });

    // make download link
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `code.${lang_comp}`;
    link.href = fileUrl;
    link.click();
  }
}

// function clear output running code
function clearOutput() {
  $("#result").html("");
}

// function close alert
function closeAlert() {
  alert_failed.classList.remove("flex");
  alert_failed.classList.add("hidden");
}


// export {getCode, runCode, newPage, downloadCode, clearOutput, closeAlert}