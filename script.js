var API_DOMAIN = "https://api.instagram.com/v1";
var RECENT_MEDIA_PATH = "/users/self/media/recent";
$(document).ready(function() {
  var token = window.location.hash;
  if (!token) {
    window.location.replace("./login.html");
  }
  token = token.replace("#", "?");
  var mediaUrl = API_DOMAIN + RECENT_MEDIA_PATH + token;

  $.ajax({
    method: "GET",
    url: mediaUrl,
    dataType: "jsonp",
    success: handleResponse,
    error: function() {
      alert("there has been an error...")
    }
  });
});

function handleResponse(response) {
  console.log(response);
  var user_likes = 0;
  var total_likes = 0;
  var total_caption_length = 0;
  var total_hashTags = 0;
  var dayList = [];
  var daySet = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (var i=0; i<response.data.length; i++) {
    if(response.data[i].user.user_has_liked === true){
      user_likes += 1;
    }
    if(response.data[i].likes.count !== null){
      total_likes += response.data[i].likes.count;
    }
    if(response.data[i].caption.text !== null){
      total_caption_length += response.data[i].caption.text.length;
    }
    for(var j=0; j<response.data[i].caption.text.length; j++){
      if(response.data[i].caption.text[j] === "#"){
        total_hashTags += 1;
      }
    }
    var date = new Date(response.data[i].created_time * 1000);
    var day = date.getDay();
    dayList.push(day);
  }
  var mode = function mode(arr) {
   var numMapping = {};
   var greatestFreq = 0;
   var mode;
   arr.forEach(function findMode(number) {
     numMapping[number] = (numMapping[number] || 0) + 1;

     if (greatestFreq < numMapping[number]) {
       greatestFreq = numMapping[number];
       mode = number;
     }
   });
   return +mode;
 }
 var daymode = mode(dayList);
 var percentage = (user_likes/response.data.length)*100;
 var average_likes = total_likes/response.data.length;
 var average_caption_length = total_caption_length/response.data.length;
 var average_hashTags = total_hashTags/response.data.length;

 function getSentiments(caption, i){
  $.ajax({
      method: "GET",
      url:"https://twinword-sentiment-analysis.p.mashape.com/analyze/?text=" + caption,
      headers:{"X-Mashape-Key": "PZhVoSU58ZmshQLuImiWrQy04U3Rp1DYjXDjsnkodgl0Yg6Pwp",
      "Accept": "application/json",
    },
    success: function (result) {
      console.log(result);
      console.log(result.score);
      $("#image-" + i).append("<div id='score'>" +"Positivity Score :  "+ result.score + "</div>");
      }
  });
 }

 $("#stats1").html("Ego Score : " + percentage);
 $("#stats2").html("Popularity : " + average_likes);
 $("#stats3").html("Active Day : " + daySet[daymode]);
 $("#stats4").html("Brevity : " + average_caption_length);
 $("#stats5").html("Visibility : " + average_hashTags);
 for (var i=0; i<response.data.length; i++) {
   $("#images").append("<div id='image-"+ i +"'>" + '<img src=' + response.data[i].images.standard_resolution.url + "></div>");
   $("#images").append("<div></div>",'<br>');
   $("#image-"+i).append("<div>" + response.data[i].caption.text + "</div>");
   $("#images").append("<div></div>",'<br>');
   $("#images").append("<div></div>",'<br>');
   getSentiments(response.data[i].caption.text, i);
   
 }
}


