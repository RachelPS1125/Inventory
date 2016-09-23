$(document).ready(function(){
	function closeSide(){
		$('.side-nav').css('margin-left','-15rem');
		$('.open').show();
		$('.close').hide();
	}
	function fillBorrowers(){
		$.ajax({
			url: 'https://usdangameinventory-b5d8.restdb.io/rest/borrower-information',
			method: 'GET',
			headers: {
				'x-apikey': '57d1c8248dfe9ef744ec9bfe'
			}
		}).done(function(borrowerInfo){
			console.log(borrowerInfo);
			for(var i=0; i < borrowerInfo.length; i++){
				if(games[i].Quantity > 0 && borrowerInfo.active===true){	
					$('.games-borrowed').append('<div class="borrower-info columns clearfix"><div>'+borrowerInfo.firstName+'</div><div>'+borrowerInfo.lastName+'</div><div>'+borrowerInfo.phoneNumber+'</div><div>+'+borrowerInfo.studentID+'</div><div>'+borrowerInfo.item+'</div><div>Pressme</div><div>Pressm2</div><div>');
				};	
			};
		});
	fillBorrowers;
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
		$('.av-borrow').hide();
		$('.game-borrow').hide();
		$('.av-new').hide();
		$('.game-new').show();
	});
	$('.game-borrowed-side').click(function(){
		closeSide();
		$('.game-inventory').hide();
		$('.games-borrowed').show();		
		$('.av-inventory').hide();
		$('.av-borrowed').hide();
		$('.title-out').show();
		$('.title-inventory').hide();
		$('.av-borrow').hide();
		$('.game-borrow').show();
		$('.av-new').hide();
		$('.game-new').hide();
	});
	$('.av-side').click(function(){
		closeSide();
		$('.game-inventory').hide();
		$('.games-borrowed').hide();		
		$('.av-inventory').show();
		$('.av-borrowed').hide();
		$('.title-out').hide();
		$('.title-inventory').show();
		$('.av-borrow').hide();
		$('.game-borrow').hide();
		$('.av-new').show();
		$('.game-new').hide();
	});
	$('.av-borrowed-side').click(function(){
		closeSide();
		$('.game-inventory').hide();
		$('.games-borrowed').hide();		
		$('.av-inventory').hide();
		$('.av-borrowed').show();
		$('.title-out').show();
		$('.title-inventory').hide();
		$('.av-borrow').show();
		$('.game-borrow').hide();
		$('.av-new').hide();
		$('.game-new').hide();
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
	$('.add').click(function(){
		$('.overlay').fadeIn(1000);
	});
	$(".close-window").click(function(event){
		event.preventDefault();
		$('.overlay').fadeOut(1000);
	});
	$('.new-borrow').submit(function(event){
		event.preventDefault();
		var first = $('.first-name').val();
		var last = $('.last-name').val();
		var phone = $('.phone').val();
		var studentID = $('.id-num').val();
		var time = $('.time').val();
		console.log(first);
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
		}).done(function(){
			console.log('record added');
		});
	});
};