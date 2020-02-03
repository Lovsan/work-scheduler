$(document).ready(function(){
	var line1 = new Array();
	var month1 = new Array();
	var weeks = new Array();
	var week = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
	var totalDaysCountinWeek = 5;
	var totalDaysCountinMonth = 10;
	var totalMonthMinutes = 0;
	var totalWeekMinutes = 0;
	generateWeeks();
	ListWeek();
	ListMonth();
	bindTooltip('#chart2')
	bindTooltip('#chart1')
	
  var plot1 = $.jqplot('chart1', [line1], {
    title: 'Weekly Report',
    series:[{renderer:$.jqplot.BarRenderer}, {xaxis:'x2axis', yaxis:'y2axis'}],
    axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
        tickOptions: {
          angle: -30,
          fontSize: '10pt',
          fontFamily: 'Arial'
        }
    },
    axes: {
      xaxis: {
        renderer: $.jqplot.CategoryAxisRenderer
      }
    }
  });
  var plot2 = $.jqplot('chart2', [month1], {
	    title: 'Current Month Report',
	    series:[{renderer:$.jqplot.BarRenderer}, {xaxis:'x2axis', yaxis:'y2axis'}],
	    axesDefaults: {
	        tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
	        tickOptions: {
	          angle: -30,
	          fontSize: '10pt',
	          fontFamily: 'Arial'
	        }
	    },
	    axes: {
	      xaxis: {
	        renderer: $.jqplot.CategoryAxisRenderer
	      }
	    }
  });
 
  
  function bindTooltip(id)
  {
	  $(id).bind('jqplotDataHighlight', 
	        function (ev, seriesIndex, pointIndex, data, radius) {    
	            x = ev.pageX-100;
	            y = ev.pageY;
	            var color = 'rgb(50%,50%,100%)';
	           
	            var html1 = '<table>'+
				    		'<tr>'+
				    			'<td colspan=2>'+
				    				'<span style="font-size:16px;font-weight:bold;color:rgb(100%,40%,50%)">'+
				    					data[2]+
				    				'</span>'+
				    			'</td>'+
				    		'</tr>'+
				    		'<tr>'+
				    			'<td>From &nbsp;:</td>'+
				    			'<td>'+data[3]+'</td>'+
				    		'</tr>'+
				    		'<tr>'+
				    			'<td>To&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :</td>'+
				    			'<td>'+data[4]+'</td>'+
				    		'</tr>'+
				    		'<tr>'+
				    			'<td>Hours :</td>'+
				    			'<td>'+data[5]+'</td>'+
				    		'</tr>'+
							'<tr>'+
				    			'<td>Comments :</td>'+
				    			'<td>'+data[6]+'</td>'+
				    		'</tr>'+
				    		'</table>';
	            
	            $('#tooltip1b').css({left:x+10, top:y+10});
	            $('#tooltip1b').html(html1);
	            $('#tooltip1b').show();
	        });
		    
	    // Bind a function to the unhighlight event to clean up after highlighting.
	    $(id).bind('jqplotDataUnhighlight', 
	        function (ev, seriesIndex, pointIndex, data) {
	            $('#tooltip1b').empty();
	            $('#tooltip1b').hide();
	    });
 	}
  
	function calculateDiffTimeFormat(fromTime,toTime)
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
		//totalMinutes = totalMinutes + (hourDiff * 60) + minDiff;
		return difference;
	}

	function calculateDifference(fromTime,toTime,isMonth)
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
		if(isMonth)
		{
			totalMonthMinutes = totalMonthMinutes + (hourDiff * 60) + minDiff;
		}
		if(!isMonth)
		{
			totalWeekMinutes = totalWeekMinutes + (hourDiff * 60) + minDiff;
		}
		
		return ((hourDiff * 60) + minDiff)/60;
	}
	
	function generateWeeks()
	{
		
		var i=0;
		var index = 0;
		weekGen(weeks,i,index);
	}
	
	function weekGen(weeks,i,index)
	{
		var oldweeks = localStorage.getItem("oldWeeks");//Retrieve the stored data
		oldweeks = JSON.parse(oldweeks); 
		if(oldweeks == null)
			oldweeks = [];
			
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
	
	function ListWeek(){
		
		var tbClients = weeks[weeks.length-1]
		for(var i in tbClients){
			var cli = JSON.parse(tbClients[i]);
			var date = new Date(cli.DATE)
			
			var temp = new Array();
			temp[0] = week[date.getDay()-1];
			temp[1] = calculateDifference(cli.FROM,cli.TO,false);
			temp[2] = cli.DATE;
			temp[3] = cli.FROM;
			temp[4] = cli.TO;
			temp[5] = calculateDiffTimeFormat(cli.FROM,cli.TO);
			if(cli.COMMENT == null)
			{
				temp[6] = '';
			}
			else
			{
				temp[6] = cli.COMMENT;
			}
			line1[i] = temp;
		}
		
		if(line1.length < totalDaysCountinWeek)
		{
			var difference = totalDaysCountinWeek - line1.length;
			var length = (line1.length)
			for(i=0;i<difference;i++)
			{
				var temp = new Array();
				temp[0] = length + i;
				temp[1] = 0;
				line1[length + i] = temp;
			}
		}
		
		if(line1 == '' || line1 == null)
		{
			var temp = new Array();
			temp[0] = 'No data found';
			temp[1] = 0;
			line1[0] = temp;
		}
		$('#totalWeekHours').html(Math.floor(totalWeekMinutes/60))
	}
	
	function ListMonth(){
		var totalDaysCalculated = 0;
		var oldWeeks = localStorage.getItem("oldWeeks");//Retrieve the stored data
		oldWeeks = JSON.parse(oldWeeks); 
		if(oldWeeks == null)
			oldWeeks = [];
		var currentMonth = new Date().getMonth();
		var j =0;
		for(var i in oldWeeks){
			var cli = JSON.parse(oldWeeks[i]);
			var cliDate = new Date(cli.DATE)
			
			if(cliDate.getMonth() == currentMonth)
			{
				var temp = new Array();
				temp[0] = $.datepicker.formatDate('dd/mm/yy', cliDate)
				temp[1] = calculateDifference(cli.FROM,cli.TO,true);
				temp[2] = cli.DATE;
				temp[3] = cli.FROM;
				temp[4] = cli.TO;
				temp[5] = calculateDiffTimeFormat(cli.FROM,cli.TO);
				if(cli.COMMENT == null)
				{
					temp[6] = '';
				}
				else
				{
					temp[6] = cli.COMMENT;
				}
				if(temp[1] > 0)
				{
					totalDaysCalculated++;
				}
				month1[j++] = temp;
			}
		}
		if(month1.length < totalDaysCountinMonth)
		{
			var difference = totalDaysCountinMonth - month1.length;
			var length = (month1.length)
			for(i=0;i<difference;i++)
			{
				var temp = new Array();
				temp[0] = length + i;
				temp[1] = 0;
				month1[length + i] = temp;
			}
		}
		
		if(month1 == '' || month1 == null)
		{
			var temp = new Array();
			temp[0] = 'No data found';
			temp[1] = 0;
			month1[0] = temp;
		}
		
		var totalMonthHours = Math.floor(totalMonthMinutes/60) + (((totalMonthMinutes/60)%1)*(6/10));
		var totalTargetMonthHours = Math.floor(totalDaysCalculated * 8.5) 
											+ (((totalDaysCalculated * 8.5)%1)*(6/10));
		$('#totalMonthHours').html(totalMonthHours.toFixed(2))
		$('#totalMonthDays').html(totalDaysCalculated.toFixed(2))
		$('#totalTargetMonthHours').html(totalTargetMonthHours.toFixed(2))
	}
});