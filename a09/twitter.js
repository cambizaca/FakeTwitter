$(function() {
  TweetFeed();
})

let data;

//resources : https://versions.bulma.io/0.7.0/documentation/components/navbar/

async function TweetFeed() {
  $("#TwitterFeild").empty();
    const response = await $.ajax(
      {
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        xhrFields: { withCredentials: true },
      })
        .then(res => makeTweetBox(res))
        .catch(err => console.error(err));
  };
  
  function makeTweetBox(res) {
    data = res;
    for(let i = 0; i < 50; i++) {
      createTweetBoxesToAppend(data[i], i);
    }
  };

  document.getElementById('sendTweet').addEventListener('click', sentTweet);

  function sentTweet() {
    document.getElementById("sendTweet").removeEventListener("click", sentTweet);
    let form = $(`<div id="tweetForm" class='container is-half'>
                    <div class='column is-fourth'>
                      <div class="field">
                        <label class="label">Message</label>
                        <div class="control">
                          <textarea class="textarea" id="tweetBody" placeholder="What's happening?"> </textarea>
                        </div>
                      </div>
                    </div>
                    <div class="buttons"> 
                      <button id="tweet" class="button is-light is-small">Tweet</button>
                      <button id="cancel" class="button is-light is-small">Cancel</button>
                  </div>
                </div>
                  </div>`);
    $("#EnterTweet").append(form);
    $("#cancel").on('click', ()  =>  {
        $("#tweetForm").remove();
        document.getElementById('sendTweet').addEventListener('click', sentTweet);
    });
    $("#tweet").on('click', ()  =>  {
      postTweet();
    });
      
  }

  async function postTweet() {
    var text = $("#tweetBody").val();
    const result = $.ajax({
      method: 'post',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
      xhrFields: { withCredentials: true },
      data: {
        body: text
      },
    })
    .then(res => addLatestTweet(res))
    .catch(err => console.error(err));
    
    $("#tweetForm").remove();
    document.getElementById('sendTweet').addEventListener('click', sentTweet);
  }

  function addLatestTweet(res){
    $("#TwitterFeild").empty();
      data.pop();
      data = [res].concat(data);
      for(let i = 0; i < 50; i++) {
       createTweetBoxesToAppend(data[i], i);
      }
  }

  function createTweetBoxesToAppend (tweetInfo, i) {
    let returnTweetDiv;
        if(tweetInfo.isMine == true) {
          returnTweetDiv = document.createElement('div').innerHTML = 
          `<div id="tweetDivBox${tweetInfo.id}" class='box is-centered'>
            <h3 class="title is-3"> ${tweetInfo.author} </h3>
            <p id="tweetPTag${tweetInfo.id}"> ${tweetInfo.body} </p>
            <div class="is-grouped"> 
              <span id = "span${tweetInfo.id}"> Likes: ${tweetInfo.likeCount} </span>
              <span id="spanRTs${tweetInfo.id}">  Retweets: ${tweetInfo.retweetCount} </span>
              <button id="retweet${tweetInfo.id}" class="button is-light is-small px-1">Retweet</button>
              <span id="spanRep${tweetInfo.id}">  Replies: ${tweetInfo.replyCount} </span>
              <button id="reply${tweetInfo.id}" class="button is-light is-small  px-1">Reply</button>
              <button id="edit${tweetInfo.id}" class="button is-light is-small px-1" )>Edit</button>
              <button id="delete${tweetInfo.id}" class="button is-light is-small px-1" >Delete Tweet</button>
            </div>
            <div id="replyForm${tweetInfo.id}"></div>
          </div>`;
        } else {
          returnTweetDiv = document.createElement('div').innerHTML = 
          `<div id="tweetDivBox${tweetInfo.id}" class='box is-centered'>
            <h3 class="title is-3"> ${tweetInfo.author} </h3>
            <p id="tweetPTag${tweetInfo.id}"> ${tweetInfo.body} </p>
            <div class="is-grouped"> 
              <span id = "span${tweetInfo.id}"> Likes: ${tweetInfo.likeCount} </span>
              <button id="likeButton${tweetInfo.id}" class="button is-light is-small px-1">Like</button>;
              <span id="spanRTs${tweetInfo.id}">  Retweets: ${tweetInfo.retweetCount} </span>
              <button id="retweet${tweetInfo.id}" class="button is-light is-small px-1">Retweet</button>
              <span id="spanRep${tweetInfo.id}">  Replies: ${tweetInfo.replyCount} </span>
              <button id="reply${tweetInfo.id}" class="button is-light is-small  px-1">Reply</button>
            </div>
            <div id="replyForm${tweetInfo.id}"></div>
          </div>`;
        
        }        

        $("#TwitterFeild").append(returnTweetDiv);
        checkIfILiked(tweetInfo.someLikes, tweetInfo.id, tweetInfo.likeCount);
        $( "#likeButton"+ tweetInfo.id).on('click', e => {
          addLike(i, tweetInfo.someLikes, tweetInfo.id, tweetInfo.likeCount)
        });
        $( "#reply"+ tweetInfo.id).on('click', e => {
          replyForm(tweetInfo.id, tweetInfo.replyCount)
        });
        $( "#retweet"+ tweetInfo.id).on('click', e => {
          retweet(tweetInfo.author , tweetInfo.id, tweetInfo.body, tweetInfo.retweetCount)
        });
        if(tweetInfo.isMine == true) {
          $( "#delete"+ tweetInfo.id).on('click', e => {
            deleteTweetAndDiv( tweetInfo.id)
          });
          $( "#edit"+ tweetInfo.id).on('click', e => {
            ediitTweet(tweetInfo.id, tweetInfo.body)
          });
        }
    return returnTweetDiv;
  }

    function ediitTweet(id, body) {
      $( "#edit"+ id).off("click");    
      let form = $(`<div id="updateForm" class='container is-half'>
                      <div id="errorMes${id}"> </div>
                      <div class='column is-fourth'>
                        <div class="field">
                          <label class="label">Reply</label>
                          <div class="control">
                            <textarea class="textarea" id="updateBody${id}" placeholder="What's happening?"> ${body} </textarea>
                          </div>
                        </div>
                      </div>
                      <div class="buttons"> 
                        <button id="subRep${id}" class="button is-light is-small">Update</button>
                        <button id="cancelEdit${id}" class="button is-light is-small">Cancel</button>
                    </div>
                  </div>
                    </div>`);
      $("#replyForm"+id).append(form);
      $("#cancelEdit"+id).on('click', ()  =>  {
          $("#replyForm"+id).empty();
          $( "#edit"+ id).on('click', e => {
            ediitTweet(id, body)
          });
      });
      $("#subRep"+id).on('click', ()  =>  {
        varUpdate(id);
      });
    }

    async function varUpdate(id) {
      var str = $("#updateBody"+id).val();
      var n = str.length;
      if(n < 281) {
        $("errorMes"+id).empty();
        const result = await $.ajax({
          method: 'put',
          url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/'+id,
          xhrFields: { withCredentials: true },
          data: {
            body: $("#updateBody"+id).val()
          },
        });
        $("#replyForm"+id).empty();
        $( "#edit"+ id).on('click', e => {
          ediitTweet(id, body)
        });
        $("#tweetPTag"+id).empty();
        $("#tweetPTag"+id).append(str);
      } else{
        let warningDiv =  
        `<div class="notification is-warning">
        <strong>Oops, please mmake sure your update is less than 280 charecters </strong>
        </div>`;
        $("#errorMes"+id).append(warningDiv);
      }

    }





    async function deleteTweetAndDiv(id) {
      const result = await $.ajax({
        method: 'delete',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + id,
        xhrFields: { withCredentials: true },
      });
      $("#tweetDivBox"+id).remove();
      TweetFeed();
    }


  function checkIfILiked(likesArray, tweetID, likeCount) {
    if(likesArray.includes('Christian C.')){
      $("#span"+tweetID).empty();
      $("#likeButton"+tweetID).empty();
      $("#likeButton"+tweetID).append("Unlike");
      $("#span"+tweetID).append("Likes: "+ likeCount + "; You Like This Tweet! ");
    }
  }

  async function addLike(x, likesArray, tweetID, likeCount) {
    if(!data[x]['someLikes'].includes('Christian C.')) {  //manipulate DOM; send axios call; check if name is not there   
      data[x]['someLikes'].push('Christian C.');
      data[x]['likeCount']++;
      $("#span"+tweetID).empty();
      $("#likeButton"+tweetID).empty();
      $("#likeButton"+tweetID).append("Unlike");
      $("#span"+tweetID).append("Likes: "+ data[x]['likeCount'] + "; You Like This Tweet! ");
      const result = await $.ajax({
        method: 'put',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/'+ tweetID +'/like',
        xhrFields: { withCredentials: true },
      })
      .then(res => console.log(res))
      .catch(err => console.error(err));
      console.log(data[x]['someLikes']);
    } 
    else if (data[x]['someLikes'].includes('Christian C.')) { // gotta unlike
      const index = data[x]['someLikes'].indexOf('Christian C.');
      if (index > -1) {
        data[x]['someLikes'].splice(index, 1);
      }
      data[x]['likeCount']--;
      $("#span"+tweetID).empty();
      $("#likeButton"+tweetID).empty();
      $("#likeButton"+tweetID).append("Like");
      $("#span"+tweetID).append("Likes: "+ data[x]['likeCount']);
      const result = await $.ajax({
        method: 'put',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/'+ tweetID +'/unlike',
        xhrFields: { withCredentials: true },
      })
      .then(res => console.log(res))
      .catch(err => console.error(err));
    }
  }

  function replyForm(id, count) {
    $( "#reply"+ id).off("click");    
    let form = $(`<div id="tweetForm" class='container is-half'>
                    <div class='column is-fourth'>
                      <div class="field">
                        <label class="label">Reply</label>
                        <div class="control">
                          <textarea class="textarea" id="repBody${id}" placeholder="What's happening?"> </textarea>
                        </div>
                      </div>
                    </div>
                    <div class="buttons"> 
                      <button id="subRep${id}" class="button is-light is-small">Tweet</button>
                      <button id="cancel${id}" class="button is-light is-small">Cancel</button>
                  </div>
                </div>
                  </div>`);
    $("#replyForm"+id).append(form);
    $("#cancel"+id).on('click', ()  =>  {
        $("#replyForm"+id).empty();
        $( "#reply"+ id).on('click', e => {
          replyForm(id,count)
        });
    });
    $("#subRep"+id).on('click', ()  =>  {
      submitReply(id, count)
    });
  }

  async function submitReply(id, count) {
    const result = await $.ajax({
      method: 'post',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
      xhrFields: { withCredentials: true },
      data: {
        "type": "reply",
        "parent": id,
        "body": $("#repBody"+id).val()
      },
    });
    $("#replyForm"+id).empty();
    $( "#reply"+ id).on('click', e => {
      replyForm(id)
    });
    count++;
    $( "#spanRep"+ id).empty();
    $( "#spanRep"+ id).append("Replies: " + count);

  }

  function retweet(author, id, body, count) {
    $( "#retweet"+ id).off("click");    
    let form = $(`<div id="tweetForm" class='container is-half'>
                    <div class='column is-fourth'>
                      <div class="field">
                        <label class="label">Retweet</label>
                        <div class="control">
                          <textarea class="textarea" id="repBody${id}"> Retweet from ${author}: ${body}</textarea>
                        </div>
                      </div>
                    </div>
                    <div class="buttons"> 
                      <button id="subRT${id}" class="button is-light is-small">Reweet</button>
                      <button id="cancelRT${id}" class="button is-light is-small">Cancel</button>
                  </div>
                </div>
                  </div>`);
    $("#replyForm"+id).append(form);
    $("#cancelRT"+id).on('click', ()  =>  {
      $("#replyForm"+id).empty();
      $( "#retweet"+ id).on('click', e => {
        retweet(author, id, body, count)
      });
    });
    $("#subRT"+id).on('click', ()  =>  {
      submitRT(id, count, body)
    });


  }

  async function submitRT(id, count, body) {
    const result = await $.ajax({
      method: 'post',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
      xhrFields: { withCredentials: true },
      data: {
        "type": "retweet",
        "parent": id,
        "body": $("#repBody"+id).val()
      },
    });
    $("#replyForm"+id).empty();
    $( "#retweet"+ id).on('click', e => {
      retweet(id, body, count)
    });
    count++;
    $( "#spanRTs"+ id).empty();
    $( "#spanRTs"+ id).append("Retweets: " + count);
    TweetFeed();
  }







  
  // {"id":47463,
  // "type":"tweet",
  // "body":"super bowl 45",
  // "author":"Advaith D.",
  // "isMine":false,
  // "isLiked":false,
  // "retweetCount":0,
  // "replyCount":0,
  // "likeCount":1,
  // "someLikes":["Rohitha M."],
  // "createdAt":1618858491272,
  // "updatedAt":1618858491272}