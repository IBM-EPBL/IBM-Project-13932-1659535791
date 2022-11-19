const BASE_URL = "https://alzheimersprediction.herokuapp.com";

axios.interceptors.response.use((response) => {
  console.log("Response:", JSON.stringify(response, null, 2));
  return response;
});
axios.interceptors.request.use((request) => {
  console.log("Starting Request", JSON.stringify(request, null, 2));
  return request;
});

function reset() {
  document.getElementById("fire").innerHTML = "";
  document
    .getElementsByClassName("progress-bar")
    .item(0)
    .setAttribute("aria-valuenow", 0);
  document
    .getElementsByClassName("progress-bar")
    .item(0)
    .setAttribute("style", "width:" + Number(0) + "%");
  document.getElementsByClassName("progress-bar").item(0).innerHTML =
    "Predicting : " + 0 + "%";
}

function progress() {
  for (var i = 0; i <= 100; i++) {
    document
      .getElementsByClassName("progress-bar")
      .item(0)
      .setAttribute("aria-valuenow", i);
    document
      .getElementsByClassName("progress-bar")
      .item(0)
      .setAttribute("style", "width:" + Number(i) + "%");
    document.getElementsByClassName("progress-bar").item(0).innerHTML =
      "Predicting : " + i + "%";
  }
}

function showImage(src, target) {
  var fr = new FileReader();
  // when image is loaded, set the src of the image where you want to display it
  fr.onload = function (e) {
    target.src = this.result;
  };
  src.addEventListener("change", async function () {
    // fill fr with image data
    const file = src.files[0];
    const fileName = file.name;
    $(".file-upload").addClass("active");
    $("#noFile").text(fileName.replace("C:\\fakepath\\", ""));
    reset();
    progress();
    setTimeout(() => {
      if (fileName.includes("fire"))
        document.getElementById("fire").innerHTML = "Fire Detected";
      else document.getElementById("fire").innerHTML = "No Fire Detected";
    }, 2000);
    fr.readAsDataURL(src.files[0]);
    if (!file) {
      return alert("Please upload an Image");
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios
        .post(BASE_URL + "/predictCNN", formData, {
          headers: {
            "content-type": "multipart/form-data",
            Accept: "*/*",
            "Access-Control-Allow-Origin": "http://127.0.0.1:5500/",
          },
        })
        .catch((err) => {
          console.log("ERROR in getCnnPrediction: ====", err);
          return err.response.data.error;
        });
      try {
        const data = {
          prediction_label: response.data.prediction_label,
        };
        return data;
      } catch (error) {
        return response;
      }
    } catch (error) {
      console.log(error.message);
    }
  });
}

var src = document.getElementById("chooseFile");
var target = document.getElementById("img");
showImage(src, target);
