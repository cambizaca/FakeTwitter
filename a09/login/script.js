$(function() {

  const $form = $('#login-form');
  const $message = $('#message');

  $form.submit(function(e) {
    e.preventDefault();

    $message.html('');

    const data = $form.serializeArray().reduce((o, x) => {
      o[x.name] = x.value;
      return o;
    }, {});
    
    $.ajax({
      url: 'https://comp426-1fa20.cs.unc.edu/sessions/login',
      type: 'POST',
      data,
      xhrFields: {
          withCredentials: true,
      },
    }).then(() => {
      $message.html('<span class="has-text-success">Success! You are now logged in.</span>');
      window.location.href = "../index.html";
    }).catch(() => {
      $message.html('<span class="has-text-danger">Something went wrong and you were not logged in. Check your email and password and your internet connection.</span>');
    });
  });



});

// function TweetFeed() {
//   const navbarString = '<nav class="navbar" role="navigation" aria-label="main navigation"> <div class= "navbar-brand"> <a class="navbar-item" href="https://versions.bulma.io/0.7.0"><img src="https://comp426.com/img/twitter.png" alt="Bulma: a modern CSS framework based on Flexbox" width="28" height="28"></a><a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"><span aria-hidden="true"></span> <span aria-hidden="true"></span><span aria-hidden="true"></span></a></div></nav >';
//   let $root = $("<div id='root'> </div>");
//   let navbar = $(navbarString); 
  
//   createTweetBoxDiv();
//   $root.append(navbar);
//   $("body").append($root);

// };

// async function createTweetBoxDiv() {
//   const response = await $.ajax(
//     {
//       method: 'get',
//       url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
//       xhrFields: { withCredentials: true },
//     })
//       .then(res => makeTweetBox(res))
//       .catch(err => console.error(err));

//   // let tweetDiv = document.createElement('div');
// }

// function makeTweetBox(res) {
//   let $TweetFeed = $("<div class='tweetFeed is-one-quarter'> </div> id='tweetFeed");
//   $("body").append($TweetFeed);
//   // const innerHTMLForTweetData = `<div class='card card-body mb-4'> <h5> Author: ${res.author[i]}' </h5></div>`;

//   let tweetBoxDiv = '' 
//   for(let i = 0; i < 49; i++) {
//     // const tweetDiv = document.createElement('div').innerHTML;
//     let tweetDiv = document.createElement('div').innerHTML = 
//       `<div class='card card-body mb-4'>
//         <h5> Author: ${res[i].author} </h5>
//       </div>`;
//     // tweetDiv.innerHTML = innerHTMLForTweetData;
//     $TweetFeed.append(tweetDiv);
//   }
// };

// // {"id":47463,
// // "type":"tweet",
// // "body":"super bowl 45",
// // "author":"Advaith D.",
// // "isMine":false,
// // "isLiked":false,
// // "retweetCount":0,
// // "replyCount":0,
// // "likeCount":1,
// // "someLikes":["Rohitha M."],
// // "createdAt":1618858491272,
// // "updatedAt":1618858491272}