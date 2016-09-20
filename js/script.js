$(document).ready(function(){
	function closeSide(){
		$('.side-nav').css('margin-left','-15rem');
		$('.open').show();
		$('.close').hide();
	}
	$('.open').click(function(){
		$('.side-nav').css('margin-left','0');
		$('.open').hide();
		$('.close').show();
	});
	$('.close').click(function(){
		closeSide();
	});
	$('.gaming-side').click(function(){
		closeSide();
		$('.game-inventory').show();
		$('.games-borrowed').hide();		
		$('.av-inventory').hide();
		$('.av-borrowed').hide();
		$('.title-out').hide();
		$('.title-inventory').show();
	});
	$('.game-borrowed-side').click(function(){
		closeSide();
		$('.game-inventory').hide();
		$('.games-borrowed').show();		
		$('.av-inventory').hide();
		$('.av-borrowed').hide();
		$('.title-out').show();
		$('.title-inventory').hide();
	});
	$('.av-side').click(function(){
		closeSide();
		$('.game-inventory').hide();
		$('.games-borrowed').hide();		
		$('.av-inventory').show();
		$('.av-borrowed').hide();
		$('.title-out').hide();
		$('.title-inventory').show();
	});
	$('.av-borrowed-side').click(function(){
		closeSide();
		$('.game-inventory').hide();
		$('.games-borrowed').hide();		
		$('.av-inventory').hide();
		$('.av-borrowed').show();
		$('.title-out').show();
		$('.title-inventory').hide();
	});
	$.ajax({
		url: 'https://usdangameinventory-b5d8.restdb.io/rest/games',
		method: 'GET',
		headers: {
			'x-apikey': '57d1c8248dfe9ef744ec9bfe'
		}
	}).done(function(games){
		for(var i=0; i < games.length; i++){
			if(games[i].Quantity > 0){	
				$('.item-list').append('<option value="'+games[i]._id+'">'+ games[i].Name +' - ' + games[i].Quantity +'</option>');
			};
		};
	});
	$('.submit').click(function(){
		var first = $('.first-name').val();
		var last = $('.last-name').val();
		var phone = $('.phone').val();
		var studentID = $('.id-num').val();
		var time = $('.time').val();
		$.ajax({
		url: 'https://usdangameinventory-b5d8.restdb.io/rest/borrower-information',
		method: 'POST',
		data: {
			'firstName': first,
			'lastName': last,
			'phoneNumber': phone,
			'studentID': studentID,
			'timeBorrowed': time,
			'active': true
		},
		headers: {
			'x-apikey': '57d1c8248dfe9ef744ec9bfe'
		}
	}).done();
	});
});