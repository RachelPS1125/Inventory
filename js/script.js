$(document).ready(function(){
	var i = 0;
	var inventoryType
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
			$('.data-rows').empty();
			for(var i = 0; i < borrowerInfo.length; i++){
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
			};
		});
	};
	function fillInventory(){
		$.ajax({
			url: 'https://usdangameinventory-b5d8.restdb.io/rest/'+inventoryType,
			method: 'GET',
			headers: {
				'x-apikey': '57d1c8248dfe9ef744ec9bfe'
			}
		}).done(function(inventory){
			$('.data-rows').empty();
				for(var i = 0; i < inventory.length; i++){
					var inventoryTable = $('.template>.inventory').clone();
					template.attr('data-id', inventory[i]._id);
					inventoryTable.find('.item').text(inventory[i].Name);
					inventoryTable.find('.quantity').text(inventory[i].Quantity);
					inventoryTable.find('.available').text(inventory[i].Quantity);
					inventoryTable.find('.location').text(inventory[i].itemLocation);
					$('.data-rows').append(inventoryTable);
			};
		});
	}
	function populateInventoryDropDown(inventory){
		$('.inventory-list').empty();
		for(var i=0; i < inventory.length; i++){
			if(inventory[i].Quantity > 0){
				$('.inventory-list').append('<option value="'+inventory[i].Name+'">'+ inventory[i].Name +' - ' + inventory[i].Quantity +'</option>');
			};
		};
	}
	function getInventoryList(table, f){
		$.ajax({
			url: 'https://usdangameinventory-b5d8.restdb.io/rest/' + table,
			method: 'GET',
			headers: {
				'x-apikey': '57d1c8248dfe9ef744ec9bfe'
			}
		}).done(f);
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
					'available': itemQuantity + change,
				}	
			});
		});
	}
	function showList(){
		$('.inventory-list').show();
	}
	function showInventoryForm(){
		$('.new-borrow').hide();
		$('.new-inventory').show();
	}
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
		$('.title-out').hide();
		$('.title-inventory').show();
		$('.game-borrow').hide();
		$('.av-new').hide();
		$('.game-new').show();
		inventoryType = 'games'
		fillInventory();
	});
	$('.game-borrowed-side').click(function(){
		closeSide();
		$('.game-inventory').hide();
		$('.games-borrowed').show();		
		$('.av-inventory').hide();
		$('.title-out').show();
		$('.title-inventory').hide();
		$('.game-borrow').show();
		$('.av-new').hide();
		$('.game-new').hide();
		fillBorrowers();
	});
	$('.av-side').click(function(){
		closeSide();
		$('.game-inventory').hide();
		$('.games-borrowed').hide();		
		$('.av-inventory').show();
		$('.title-out').hide();
		$('.title-inventory').show();
		$('.game-borrow').hide();
		$('.av-new').show();
		$('.game-new').hide();
		inventoryType = 'avinventory'
		fillInventory();
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
		inventoryType = 'games';
	});
	$('.av-new').click(function(){
		showInventoryForm();
		inventoryType = 'avinventory';
	});
	$(".close-window").click(function(event){
		event.preventDefault();
		$('.overlay').fadeOut(100);
	});
	$('.game-radio').click(function(){
		getInventoryList('games', populateInventoryDropDown);
		showList();
	});
	$('.av-radio').click(function(){
		getInventoryList('avinventory', populateInventoryDropDown);
		showList();
	});
	$('.new-borrow').submit(function(event){
		event.preventDefault();
		var itemName = $('.inventory-list').val();
		var first = $('#first-name').val();
		var last = $('#last-name').val();
		var phone = $('#phone').val();
		var studentID = $('#id').val();
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
		}else if(!first){
			alert('Please enter first name');
		}else if(!last){
			alert('Please enter last name');
		}else if(!phone){
			alert('Please enter phone number');
		}else if(!studentID){
			alert('Please enter student ID number');
		}else{
			alert('Please select an item');
		};
	});
	$('.new-inventory').submit(function(event){
		event.preventDefault();
		if($('#item-name').val() && $('#storage-location').val()&& $('#num-available').val()){
			$.ajax({
				url: 'https://usdangameinventory-b5d8.restdb.io/rest/'+ inventoryType,
				method: 'POST',
				data: {
					'name':$('#item-name').val(),
					'itemLocation': $('#storage-location').val(),
					'Quantity': $('#num-available').val(),
					'available': $('#num-available').val(),
				},
				headers: {
					'x-apikey': '57d1c8248dfe9ef744ec9bfe',
				}
			}).done(function(){
				getInventoryList(inventoryType, fillInventory)
				$('.overlay').fadeOut(100)
			});	
		}else if(!($('#item-name').val())){
			alert('Please enter an item name');
		}else if(!($('#num-available').val())){
			alert('Please enter the number of items')
		}else{
			alert('Please enter the storage location')
		};
	});
});