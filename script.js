var API_DOMAIN = "https://api.instagram.com/v1";
var RECENT_MEDIA_PATH = "/users/self/media/recent";
// what do you think a variable in all caps means?

$(document).ready(function() {
  var token = window.location.hash;
  if (!token) {
    window.location.replace("./login.html");
  }
  token = token.replace("#", "?"); // Prepare for query parameter
  var mediaUrl = API_DOMAIN + RECENT_MEDIA_PATH + token;

  $.ajax({
    method: "GET",
    url: mediaUrl,
    dataType: "jsonp",
    success: handleResponse,
    error: function() {
      alert("there has been an error...")
    }
  })
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

    // function analyzeSentiments(data) {
    //   $.each(data, function(index, value) {
    //     var phrase = value.caption.text;
    //     var SENTIMENT_API_BASE_URL =
    //     "https://twinword-sentiment-analysis.p.mashape.com/analyze/";
    //     $.ajax({
    //       method: "POST",
    //       url: SENTIMENT_API_BASE_URL,
    //       headers: {
    //         "X-Mashape-Key": "PZhVoSU58ZmshQLuImiWrQy04U3Rp1DYjXDjsnkodgl0Yg6Pwp"
    //       },
    //       data: {text: phrase},
    //       success: function(response) {
    //         console.log(response);
    //         addSentiment(response.type, response.score, index);
    //       }
    //     });
    //   });
    // }

//     function addSentiment(type, score, picNum) {
//   // Find the post the corresponds to this sentiment
//   var picDiv = $("#images" + picNum);
//   // Create a sentiment div
//   var sentimentDiv = $("<div></div>");
//   var sentimentI = $("<i></i>");
//   sentimentI.addClass("fa");
//   // Add the appropriate smiley using FontAwesome
//   var faClass = "fa-meh-o";
//   if (type === "positive") {
//     sentimentDiv.addClass("positive");
//     faClass = "fa-smile-o";
//   } else if (type === "negative") {
//     sentimentDiv.addClass("negative");
//     faClass = "fa-frown-o";
//   }
//   sentimentI.addClass(faClass);

//   sentimentDiv.append("Sentiment: ").append(sentimentI)
//   .append(" (score: " + score.toFixed(2) + ")");
//   picDiv.append(sentimentDiv);
  
//   updateTotalSentiment(score);
// }

// var allSentimentScores = []; // Aggregator for all sentiments so far.
// function updateTotalSentiment(score) {
//   allSentimentScores.push(score);
//   console.log(allSentimentScores, score);
//   // Calculate the average sentiment.
//   var sum = 0;
//   for (var i=0; i<allSentimentScores.length; i++) {
//     sum += allSentimentScores[i];
//   }
//   var avg = sum / allSentimentScores.length;

//   // Add nice text and colors.
//   var text = "Neutral"
//   var textClass = "";
//   if (avg > 0) {
//     text = "Positive!";
//     textClass = "positive";
//   } else if (avg < 0) {
//     text = "Negative :(";
//     textClass = "negative";
//   }

//   $("#mood").html(text + " (score: " + avg + ")");
//   $("#mood").addClass(textClass);
// }
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

$("#stats1").html("Ego Score : " + percentage);
$("#stats2").html("Popularity : " + average_likes);
$("#stats3").html("Active Day : " + daySet[daymode]);
$("#stats4").html("Brevity : " + average_caption_length);
$("#stats5").html("Visibility : " + average_hashTags);
for (var i=0; i<response.data.length; i++) {
 $("#images").append("<div></div>",'<img src=' + response.data[i].images.standard_resolution.url + '>');
 $("#images").append("<div></div>",'<br>');
 $("#images").append("<div></div>",response.data[i].caption.text);
 $("#images").append("<div></div>",'<br>');
 $("#images").append("<div></div>",'<br>');

}
}



