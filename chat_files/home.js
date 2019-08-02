// var conn = new WebSocket('ws://localhost:8080');
var histories = [];
// conn.onopen = function(e) {
//     console.log("Connection established!");
//     alert("Connection established!");
// };

// conn.onmessage = function(e) {
//     console.log(e.data);
//     addReceivedMessageToBox(e.data, formatAMPM(new Date()));
// };

$(document).ready(function(){
    $('div.video_cam > span:nth-child(2)').click(function(){
        window.open('https://hajaubot.000webhostapp.com/eq.html',
                'Call', 'width=750,height=550,left=' + Math.floor(screen.width/2 -400) +',top=' + Math.floor(screen.height/2 -325) );
    });
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });
    
    $('.send_btn').click(function () {
        onSendButtonClicked();
    });

    $('textarea.type_msg').keydown(function (e) {
        if (e.ctrlKey && e.keyCode === 13) {
            onSendButtonClicked();
        }
    });

    chatBoxScroll();
	loadHistory();
	saveHistory();
// 	$('#message_count').html(histories.length + ' Messages');
});

function onSendButtonClicked() {
    let dateTime = formatAMPM(new Date());
    let message = $('textarea.type_msg').val();
    // Send to bot if prefix of message is dot charecter
    if(message.charAt(0) == '.'){
    	addSentMessageToBox(message, dateTime);
    	histories.push({isReceived: false, msg: message, time: dateTime});
        clearTextInput();
    	saveHistory();
    // 	$('#message_count').html(histories.length + ' Messages');
        // conn.send(message); This work with websocket
    	$.ajax({
    		type: "GET",
    		url:'/chat/simsimi.php?ask=' + message, 
    		success: function(data){
    			let receivedTime = formatAMPM(new Date());
    			addReceivedMessageToBox(data, receivedTime);
    			histories.push({isReceived: true, msg: data, time: receivedTime});
    			saveHistory();
    // 			$('#message_count').html(histories.length + ' Messages');
    			}
    		});
    }
}

function chatBoxScroll() {
    let textArea = $('.card-body.msg_card_body');
    textArea.scrollTop(textArea[0].scrollHeight);
}
function clearTextInput() {
    $('textarea.type_msg').val('');
}
function addSentMessageToBox(msg, time) {
    $(".card-body.msg_card_body")
        .append('<div class="d-flex justify-content-end mb-4">' +
            '                        <div class="msg_cotainer_send">' +
            '                            '+ msg + '' +
            '                            <span class="msg_time_send">'+time+'</span>' +
            '                        </div>' +
            '                        <div class="img_cont_msg">' +
            '                            <img src="./assets/img/you.jpg" class="rounded-circle user_img_msg">\n' +
            '                        </div>' +
            '                    </div>');
    chatBoxScroll();
}

function addReceivedMessageToBox(msg, time) {
    $(".card-body.msg_card_body")
        .append('<div class="d-flex justify-content-start mb-4">\n' +
    '                        <div class="img_cont_msg">\n' +
    '                            <img src="./assets/img/michau.jpg" class="rounded-circle user_img_msg">\n' +
    '                        </div>\n' +
    '                        <div class="msg_cotainer">\n' +
    '                            ' + msg + '\n' +
    '                            <span class="msg_time">'+time+'</span>\n' +
    '                        </div>\n' +
    '                    </div>');
    chatBoxScroll();
}

function loadHistory(){
	histories = JSON.parse(localStorage.getItem('histories'));
	if(histories == null){
		histories = [];
		return;
	}
	for(var i = 0; i < histories.length; i++){
		if(histories[i].isReceived){
			addReceivedMessageToBox(histories[i].msg, histories[i].time);
		}else{
			addSentMessageToBox(histories[i].msg, histories[i].time);
		}
	}
}

function saveHistory(){
	localStorage.setItem('histories', JSON.stringify(histories));
}
// Function from internet
function formatAMPM(date) {
    // source stackoverflow.com
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}