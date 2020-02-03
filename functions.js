$(function(){

	var operation = "A"; //"A"=Adding; "E"=Editing

	var selected_index = -1; //Index of the selected list item
	var avgHoursPerDay = 9;
	
	
	var oldweeks = JSON.parse(localStorage.getItem("oldWeeks"));
	if(oldweeks == null) //If there is no data, initialize an empty array
		oldweeks = [];
	oldweeks.sort(sortByDate)
	localStorage.setItem("oldWeeks", JSON.stringify(oldweeks));
	
	var weeks = new Array();
	generateWeeks();
	var weeksIndex = weeks.length-1;
	
	function Add(){	
		if(!validateFields())
		{
			return false;
		}
		if(recordExist($("#dateID").val()))
		{
			Edit();
		}
		else
		{
			var client = JSON.stringify({
				DATE  : $("#dateID").val(),
				FROM  : $("#fromTime").val(),
				TO : $("#toTime").val(),
				COMMENT : $("#comments").val()
			});
		
			oldweeks.push(client);
			localStorage.setItem("oldWeeks", JSON.stringify(oldweeks));
			alert("The record is added.");
			window.navigate = '#'
		}
	}
	
	function recordExist(date)
	{
		for(var j in oldweeks){
			var cli2 = JSON.parse(oldweeks[j])
			if(date == cli2.DATE)
			{
				return true;
			}
		}
		return false;
	}
	
	function generateWeeks()
	{
		
		var i=0;
		var index = 0;
		weekGen(weeks,i,index);
	}
	
	function weekGen(weeks,i,index)
	{
		var week = new Array();
		
		var weekIndex = 0
		for(var j=0;j<7;j++)
		{
			if(i < oldweeks.length)
			{
				var cli = JSON.parse(oldweeks[i]);
				var date = new Date(cli.DATE)
				if(j == date.getDay()-1)
				{
					week[weekIndex++] = JSON.stringify(cli);
					i++;
				}
			}
			
			if(j == 6)
			{
				weeks[index++] = week;
				
				week = new Array();
				weekIndex = 0;
			}
		}
		
		if(i < oldweeks.length)
		{
			weekGen(weeks,i,index);
		}
	}
	
	function clearForm()
	{
		$("#dateID").val('')
		$("#fromTime").val('')
		$("#toTime").val('')
		$("#comments").val('')
	}
	
	function startTime()
	{
		var startTime;
		var amPM = 'AM';
		if(localStorage.getItem("startTime") == null || localStorage.getItem("startTime") == '')
		{
			var date = new Date();
			var startTime = JSON.stringify({
				YEAR   : date.getYear()+1900,
				MONTH  : date.getMonth(),
				DATE    : date.getDate(),
				HOUR   : date.getHours(),
				MINUTE : date.getMinutes(),
				SECOND : date.getSeconds(),
			});
			localStorage.setItem("startTime", startTime);
			startTime = JSON.parse(startTime);
		}
		else
		{
			startTime = JSON.parse(localStorage.getItem("startTime"));
		}
		
		var hour = startTime.HOUR;
		if(hour < 10)
		{
			hour = '0'+hour;
		}
		var minute = startTime.MINUTE;
		if(minute < 10)
		{
			minute = '0'+minute;
		}
		
		$('#intimeDiv').html(hour+":"+minute);
		$('#outtimeDiv').html('');
		$("#fromTime").val(hour+':'+minute+' '+amPM)
		$("#toTime").val('')
		$("#comments").val('')
		digitalClock();
	}
	
	function stopTime()
	{
		var amPM = 'AM';
		var startTime = localStorage.getItem("startTime");
		if((startTime == null || startTime == '') && $("#fromTime").val() == '')
		{
			alert('Please select start time')
			return;
		}
		var stopTime;
		
		if(localStorage.getItem("stopTime") == null || localStorage.getItem("stopTime") == '')
		{
			var date = new Date();
			stopTime = JSON.stringify({
				YEAR   : date.getYear()+1900,
				MONTH  : date.getMonth(),
				DATE    : date.getDate(),
				HOUR   : date.getHours(),
				MINUTE : date.getMinutes(),
				SECOND : date.getSeconds(),
			});
			localStorage.setItem("stopTime", stopTime);
			stopTime = JSON.parse(stopTime)
		}
		else
		{
			stopTime = JSON.parse(localStorage.getItem("stopTime"));
		}
		var hour = stopTime.HOUR;
		if(hour < 10)
		{
			hour = '0'+hour;
		}
		var minute = stopTime.MINUTE;
		if(minute < 10)
		{
			minute = '0'+minute;
		}

		$('#outtimeDiv').html(hour+":"+minute);
		$("#toTime").val(hour+':'+minute+' '+amPM)
		resetTimer();
	}
	
	function digitalClock() 
	{
		var startTime = JSON.parse(localStorage.getItem("startTime"));
		if(startTime == null)
			return;
		var canvas = document.getElementById('digitalClock');
		if (canvas.getContext) {
			var c2d = canvas.getContext('2d');
			c2d.clearRect(0, 0, 300, 100);
			
			var now = new Date();
			var startDate = new Date(startTime.YEAR,startTime.MONTH,startTime.DATE,startTime.HOUR,startTime.MINUTE,startTime.SECOND);
			
			var milliSeconds = now - startDate;
			var hrs = Math.floor(milliSeconds / (1000*60*60));
			var min = Math.floor((milliSeconds/(1000*60))%60);
			var sec = Math.floor((milliSeconds/1000)%60);

			if(hrs < 10)
			{
				hrs = '0'+hrs;
			}
			if(min < 10)
			{
				min = '0'+min;
			}
			if(sec < 10)
			{
				sec = '0'+sec;
			}
			
			c2d.textBaseline = "Middle";
			c2d.font = "Bold 30px verdana";
			c2d.fillText(hrs+':'+min+':'+sec,40,30); 
			setTimeout(digitalClock,1000);
		}
	}
	
	function resetTimer()
	{
		var startTime = [];
		localStorage.setItem("startTime", startTime);
		var stopTime = [];
		localStorage.setItem("stopTime", stopTime);
	}

	function displayTimer()
	{
		
		if(localStorage.getItem("startTime") == null || localStorage.getItem("startTime") == '')
		{
			return;
		}
		
		var jsonObj = JSON.parse(localStorage.getItem("startTime"));
		
		if(jsonObj.YEAR == undefined || jsonObj.MONTH == undefined || jsonObj.DATE == undefined)
		{
			var startTime1 = [];
			localStorage.setItem("startTime", startTime1);
			return;
		}
		startTime();
		 
		if(localStorage.getItem("stopTime") == null || localStorage.getItem("stopTime") == '')
		{
			return;
		}
		stopTime();
	}
	
	function Edit(){
		
		for(var j in oldweeks){
			var cli2 = JSON.parse(oldweeks[j])
			if($("#dateID").val() == cli2.DATE)
			{
				oldweeks[j] = JSON.stringify({
					DATE  : $("#dateID").val(),
					FROM  : $("#fromTime").val(),
					TO : $("#toTime").val(),
					COMMENT : $("#comments").val(),
				});
				localStorage.setItem("oldWeeks", JSON.stringify(oldweeks));
				break;
			}
		}
		operation = "A"; //Return to default value
		return true;
	}
	
	function removeDuplicate(date)
	{
		for(var j in oldweeks){
			var cli2 = JSON.parse(oldweeks[j])
			if(date == cli2.DATE)
			{
				oldweeks.splice(j,1);
				localStorage.setItem("oldWeeks", JSON.stringify(oldweeks));
				break;
			}
		}
	}

	function Delete()
	{
		var cli = JSON.parse(weeks[weeksIndex][selected_index]);
		for(var j in oldweeks){
			var cli2 = JSON.parse(oldweeks[j])
			if(cli.DATE == cli2.DATE)
			{
				oldweeks.splice(j,1);
				localStorage.setItem("oldWeeks", JSON.stringify(oldweeks));
				break;
			}
		}
		location.reload();
	}
	var totalMinutes = 0;
	var totalDays = 0;
	
	function List(){
		
		$("#tblList").html("");
		$("#tblList").html(
			"<thead>"+
			"	<tr>"+
			"	<th></th>"+
			"	<th>Date</th>"+
			"	<th>From</th>"+
			"	<th>To</th>"+
			"	<th>Total</th>"+
			"	</tr>"+
			"</thead>"+
			"<tbody>"+
			"</tbody>"
			);
		var weeksObj = weeks[weeksIndex];
		for(var i in weeksObj){
			var cli = JSON.parse(weeksObj[i]);
			var difference = calculateDifference(cli.FROM,cli.TO);
			totalDays++;
		  	$("#tblList tbody").append("<tr title='"+cli.COMMENT+"'>"+
									 	 "	<td><img src='edit.png' alt='Edit"+i+"' class='btnEdit'  style='display:"+((weeksIndex == weeks.length - 1)?'':'none')+"'/><img src='delete.png' alt='Delete"+i+"' class='btnDelete'  style='display:"+((weeksIndex == weeks.length - 1)?'':'none')+"'/></td>" + 
										 "	<td>"+cli.DATE+"</td>" + 
										 "	<td>"+cli.FROM+"</td>" + 
										 "	<td>"+cli.TO+"</td>" + 
										 "	<td>"+difference+"</td>" +
		  								 "</tr>");
		}
		
		var tempHours = (Math.floor((totalMinutes)/60));
		var tempMin = ((totalMinutes)%60);
		var totalTime = (tempHours.toString().length == 1 ? ('0'+tempHours) : tempHours)+':'+(tempMin.toString().length == 1 ? ('0'+tempMin) : tempMin);
		
		var tempAvgHours = Math.floor(totalMinutes/(totalDays * 60));
		var tempAvgMin = Math.floor((totalMinutes/totalDays)%60);

		var avgTime = (tempAvgHours.toString().length == 1 ? ('0'+tempAvgHours) : tempAvgHours)+':'+(tempAvgMin.toString().length == 1 ? ('0'+tempAvgMin) : tempAvgMin);
		$('#totalHours').text(totalTime);
		$('#avgHours').text(avgTime);
		$('#targetHours').text(totalDays * avgHoursPerDay);
		bindEditButtons();
	}
	
	function calculateDifference(fromTime,toTime)
	{
		var fromTimeJSON = JSON.parse(JSON.stringify($.datepicker.parseTime('HH:mm z',fromTime, {})));
		var toTimeJSON = JSON.parse(JSON.stringify($.datepicker.parseTime('HH:mm z',toTime, {})));
		if(!toTimeJSON)
		{
			return '';
		}
		var fromtimezone = fromTimeJSON.timezone;
		var totimezone = toTimeJSON.timezone;
		var fromHour = fromTimeJSON.hour;
		var toHour = toTimeJSON.hour;
		
		
		if(fromtimezone == 'pm')
		{
			fromHour = fromHour + 12;
			if(fromHour == 24)
				fromHour = 12;
		}
		else
		{
			if(fromHour == 12)
				fromHour = 0;
		}
		
		if(totimezone == 'pm')
		{
			toHour = toHour + 12;
			if(toHour == 24)
				toHour = 12;
		}
		else
		{
			if(toHour == 12)
				toHour = 0;
		}
		
		var hourDiff = toHour - fromHour;
		var minDiff = toTimeJSON.minute - fromTimeJSON.minute;
		
		if(hourDiff == 0 && minDiff == 0)
		{
			hourDiff = hourDiff  + 24;
		}
		else if(hourDiff < 0)
		{
			hourDiff = hourDiff  + 24;
		}
		
		
		var tempHours = (Math.floor(((hourDiff * 60) + minDiff)/60));
		var tempMin =  ((60+minDiff)%60);
		var difference = (tempHours.toString().length == 1 ? ('0'+tempHours) : tempHours)+':'+(tempMin.toString().length == 1 ? ('0'+tempMin) : tempMin);
		
		totalMinutes = totalMinutes + (hourDiff * 60) + minDiff;
		return difference;
	}
	
	function validateFields()
	{
		var flag = true; 
		if($.trim($("#dateID").val()) == '')
		{
			flag = false;
			alert('please select Date')
		}
		else if($.trim($("#fromTime").val()) == '')
		{
			flag = false;
			alert('please select From time')
		}
		else
		{
			var currentWeek = weeks[weeks.length-1]
			for(var i in currentWeek){
				var cli = JSON.parse(currentWeek[i]);
				var enteredDate = $.trim($("#dateID").val());
				if(cli.DATE == enteredDate)
				{
					flag = false;
					alert('selected date already exist');
				}
				
			}
		}

		return flag;
	}
	
	
	
	function deleteWeek()
	{
		
		weeksIndex++;
		weeks[weeksIndex] = new Array();
		List();
		$("#paginator").pagination('updateItems', weeks.length);
		return false;
	}
	
	
	function insertArrayAt(array, index, arrayToInsert) {
	    Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
	    return array;
	}
	
	$("#btnClear").bind("click", function(){
		clearForm();
	});
	
	$("#btnStart").bind("click", function(){
		startTime();
	});
	
	$("#btnStop").bind("click", function(){
		stopTime();
	});
		
	$("#newWeek").bind("click", function(){
		operation = 'D'
	});
	
	

	$("#frmCadastre").bind("submit",function(){	

		if(operation == "A")
			return Add();
		else if(operation == "D")
			return deleteWeek()
		else
			return Edit();
	});
	List();
	
	displayTimer();
	
	function bindEditButtons()
	{
		
		$(".btnEdit").bind("click", function(){
		
			operation = "E";
			selected_index = parseInt($(this).attr("alt").replace("Edit", ""));
			
			var cli = JSON.parse(weeks[weeksIndex][selected_index]);
			$("#dateID").val(cli.DATE);
			$("#fromTime").val(cli.FROM);
			$("#toTime").val(cli.TO);
			$("#comments").val(cli.COMMENT);
			$("#dateID").attr("readonly","readonly");
		});

		$(".btnDelete").bind("click", function(){
			 if (confirm("Are you sure want to delete?") == true) {
				selected_index = parseInt($(this).attr("alt").replace("Delete", ""));
				Delete();
				List();
			}
		});
	}
	$("#dateID").datepicker();
	$("#dateID").datepicker('setDate', new Date());
	$('#fromTime').timepicker({
		hourGrid: 4,
		minuteGrid: 10,
		timeFormat: 'hh:mm tt'
	});
	$('#toTime').timepicker({
		hourGrid: 4,
		minuteGrid: 10,
		timeFormat: 'hh:mm tt'
	});

	$("#paginator").pagination({
        items: weeks.length,
        itemsOnPage: 1,
        cssStyle: 'light-theme',
        onPageClick: paginatorClick,
        currentPage:weeks.length
    });

	function paginatorClick(pageNumber, event)
	{
		weeksIndex = pageNumber-1;
		totalMinutes = 0;
		totalDays = 0;
		List();
	}
	
	function sortByDate( obj1, obj2 ) {
		var date1 = JSON.parse(obj1).DATE;
		var date2 = JSON.parse(obj2).DATE;
		if(date2 == date1)
		{
			removeDuplicate(date2)
		}
		return date2 > date1 ? -1 : 1;
	}
	
	$("textarea[@maxlength]").keypress(function(event){ 
		var key = event.which;
		
		//all keys including return.
		if(key >= 33 || key == 13) {
			var maxLength = $(this).attr("maxlength");
			var length = this.value.length;
			if(length >= maxLength) {
				
				event.preventDefault();
			}
		}
	});
	
	 $( document ).tooltip();
	 
	 
});