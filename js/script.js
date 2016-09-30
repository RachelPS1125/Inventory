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
			while(i < borrowerInfo.length){
				var borrower = borrowerInfo[i];
				if(borrower.active===true){	
					var template = $('.template>.games-borrowed').clone();
					template.attr('data-id', borrower._id);
					template.find('.first').text(borrower.firstName);
					template.find('.last').text(borrower.lastName);
					template.find('.time').text(borrower.timeBorrowed)
					template.find('.item').text(borrower.itemBorrowed);
					$('.data-rows').append(template);
				};	
				i++
			};
		});
	};
	function fillAV(){
		$.ajax({
			url: 'https://usdangameinventory-b5d8.restdb.io/rest/avinventory',
			method: 'GET',
			headers: {
				'x-apikey': '57d1c8248dfe9ef744ec9bfe'
			}
		}).done(function(avInventory){
			while(i < avInventory.length){
				var avItem = avInventory[i];	
				var template = $('.template>.games-borrowed').clone();
				template.find('.first').text(borrower.firstName);
				template.find('.last').text(borrower.lastName);
				template.find('.time').text(borrower.timeBorrowed)
				template.find('.item').text(borrower.itemBorrowed);
				$('.data-rows').append(template);
				i++
			};
		});
	}
	function getInventoryList(table){
		$.ajax({
		url: 'https://usdangameinventory-b5d8.restdb.io/rest/' + table,
		method: 'GET',
		headers: {
			'x-apikey': '57d1c8248dfe9ef744ec9bfe'
		}
		}).done(function(inventory){
			$('.inventory-list').empty();
			for(var i=0; i < inventory.length; i++){
				if(inventory[i].Quantity > 0){
					$('.inventory-list').append('<option value="'+inventory[i].Name+'">'+ inventory[i].Name +' - ' + inventory[i].Quantity +'</option>');
				};
			};
		});
	}
	function getDate(){
		var date = new Date();
		return (date.getMonth()+1) + '/' + date.getDate() + '/' + (date.getYear()-100) + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	}
	function updateQuantity(borrowOrReturn, table, that){
		var borrowID = $(that).parent().attr('data-id');
		console.log(borrowID);
		if (borrowOrReturn === 'borrow'){
			var status = true;
			var change = -1;
		}
		else{
			var status = false;
			var change = 1;
		};
		$.ajax({
			url: 'https://usdangameinventory-b5d8.restdb.io/rest/borrower-information/'+borrowID,
			method: 'PUT',
			headers: {
				'x-apikey': '57d1c8248dfe9ef744ec9bfe'
			},
			data:{
				active: status,
			}
		}).done(function(){
			$.ajax({
				url: 'https://usdangameinventory-b5d8.restdb.io/rest/' +table,
				method: 'GET',
				headers: {
					'x-apikey': '57d1c8248dfe9ef744ec9bfe'
				},
				data: {
					q:JSON.stringify({Name: $(that).parent().find('.item').text()})
				}
			}).done(function(item){
				var itemID = item[0]._id;
				var itemQuantity = item[0].Quantity;
				console.log(itemID);
				console.log(item);
				$.ajax({
					url: 'https://usdangameinventory-b5d8.restdb.io/rest/'+ table+'/'+itemID,
					method: 'PUT',
					headers: {
						'x-apikey': '57d1c8248dfe9ef744ec9bfe'
					},
					data:{
						'Quantity': itemQuantity + change,
					}	
				}).done(function(){
				});
			});
		});
	}
	var i = 0;
	fillBorrowers();
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
	/*$.ajax({
		url: 'https://usdangameinventory-b5d8.restdb.io/rest/games',
		method: 'GET',
		headers: {
			'x-apikey': '57d1c8248dfe9ef744ec9bfe'
		}
	}).done(function(games){
		for(var i=0; i < games.length; i++){
			if(games[i].Quantity > 0){
				$('.game-list').append('<option value="'+games[i].Name+'">'+ games[i].Name +' - ' + games[i].Quantity +'</option>');
			};
		};
	});*/
	$('.data-rows').on('click', '.returned', function(){
		var that = this;
		updateQuantity('return', 'games', that);
		$(that).parent().remove();
	});
	$('.add').click(function(){
		$('.overlay').fadeIn(500);
	});
	$(".close-window").click(function(event){
		event.preventDefault();
		$('.overlay').fadeOut(100);
	});
	$('.game-radio').click(function(){
		getInventoryList('games');
	});
	$('.av-radio').click(function(){
		getInventoryList('avinventory');
	});
	$('.new-borrow').submit(function(event){
		event.preventDefault();
		var first = $('.first-name').val();
		var last = $('.last-name').val();
		var phone = $('.phone').val();
		var studentID = $('.id-num').val();
		var time = getDate();
		$.ajax({
			url: 'https://usdangameinventory-b5d8.restdb.io/rest/borrower-information',
			method: 'POST',
			data: {
				'firstName': first,
				'lastName': last,
				'phoneNumber': phone,
				'studentID': studentID,
				'itemBorrowed': $('.inventory-list').val(),
				'timeBorrowed': time,
				'active': true
			},
			headers: {
				'x-apikey': '57d1c8248dfe9ef744ec9bfe'
			}
		}).done(function(){
			fillBorrowers();
			$('.overlay').fadeOut(100);
		});
	});
});