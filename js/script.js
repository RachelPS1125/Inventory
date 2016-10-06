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
	function updateQuantity(change, table, itemName){
		$('input[name="inventory-type"]').prop('checked', false);
		$('.inventory-list').hide();
		return $.ajax({
			url: 'https://usdangameinventory-b5d8.restdb.io/rest/' +table,
			method: 'GET',
			headers: {
				'x-apikey': '57d1c8248dfe9ef744ec9bfe'
			},
			data: {
				q:JSON.stringify({Name: itemName})
			}
		}).then(function(item){
			var itemID = item[0]._id;
			var itemQuantity = item[0].Quantity;
			return $.ajax({
				url: 'https://usdangameinventory-b5d8.restdb.io/rest/'+ table+'/'+itemID,
				method: 'PUT',
				headers: {
					'x-apikey': '57d1c8248dfe9ef744ec9bfe'
				},
				data:{
					'Quantity': itemQuantity + change,
				}	
			});
		});
	}
	/*function addInventory(that){
		var item = $(that)
	*/
	}
	function showList(){
		$('.inventory-list').show();
	}
	function showInventoryForm(){
		$('.new-borrow').hide();
		$('.new-inventory').show();
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
	$('.data-rows').on('click', '.returned', function(){
		var that = this;
		var borrowID = $(that).parent().attr('data-id');
		var itemName = $(that).parent().find('.item').text();
		$(that).parent().find('.-blocked').show();
		return $.ajax({
			url: 'https://usdangameinventory-b5d8.restdb.io/rest/borrower-information/'+borrowID,
			method: 'PUT',
			headers: {
				'x-apikey': '57d1c8248dfe9ef744ec9bfe'
			},
			data:{
				active: false,
			}
		}).then(function(){
			updateQuantity(1, 'games', itemName).then(function(){
				$(that).parent().remove();	
			}).fail(function(){
				alert("Something wrong happened!");
			});
		});
	});
	$('.add').click(function(){
		$('.overlay').fadeIn(500);
	});
	$('.game-borrow').click(function(){
		$('.new-borrow').show();
		$('.new-inventory').hide();
	})
	$('.game-new').click(function(){
		showInventoryForm();
	});
	$('.av-new').click(function(){
		showInventoryForm();
	});
	$(".close-window").click(function(event){
		event.preventDefault();
		$('.overlay').fadeOut(100);
	});
	$('.game-radio').click(function(){
		getInventoryList('games');
		showList();
	});
	$('.av-radio').click(function(){
		getInventoryList('avinventory');
		showList();
	});
	$('.new-borrow').submit(function(event){
		event.preventDefault();
		var itemName = $('.inventory-list').val();
		var first = $('.first-name').val();
		var last = $('.last-name').val();
		var phone = $('.phone').val();
		var studentID = $('.id-num').val();
		var time = getDate();
		if(itemName && first && last && phone && studentID){
			$.ajax({
				url: 'https://usdangameinventory-b5d8.restdb.io/rest/borrower-information',
				method: 'POST',
				data: {
					'firstName': first,
					'lastName': last,
					'phoneNumber': phone,
					'studentID': studentID,
					'itemBorrowed': itemName,
					'timeBorrowed': time,
					'active': true
				},
				headers: {
					'x-apikey': '57d1c8248dfe9ef744ec9bfe'
				}
			}).done(function(){
				updateQuantity(-1, 'games', itemName);
				fillBorrowers();
				$('.overlay').fadeOut(100);
			});
		}else if(first==false){
			alert('Please enter first name');
		}else if(last==false){
			alert('Please enter last name');
		}else if(phone==false){
			alert('Please enter phone number');
		}else if(studentID==false){
			alert('Please enter student ID number');
		}else{
			alert('Please select an item');
		};
	});
	$('.new-inventory').submit(function(event){
		event.preventDefault();
	});
});