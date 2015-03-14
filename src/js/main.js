/*
 * OTS App Javascript Core File
 * 
 * @version		1
 * @package		com.tap-code.hybridcompanion
 * @description	The Hybrid Companion Web Application			
 * @author 		James Williams (@James_RWilliams)
 * @copyright 	Copyright (c) 08/03/2015
 *
 */

var ots_news_array = window.localStorage.getItem("ots_news_array");
var content_array = JSON.parse(ots_news_array);
var i, player, story, settings, Hammer, device, lore;
	
	
	
	/**
	 *	
	 * 
	 */				
	
	function open_news(news_number){
		
		$("#flyout article").html("");
		
		$("#flyout .header h1").text(content_array[news_number][3]);
		
		$("#flyout article").html("</div><article><h2>" + content_array[news_number][0] + "</h2>" + content_array[news_number][4] + "</article><div onclick='close_news()' id='close_button'>");
		
		
		
		$('#flyout').animate({"right": '0'});
		$('body').animate("padding","50px");
		
	}
	
	/**
	 *	
	 * 
	 */				
	
	function close_news(){
		
		$('#flyout').animate({"right": '-100%'});
		
	}
	
	/**
	 *	
	 * 
	 */		
	 
	function render_news(){
		
		$(".article_list").html("");
	
		for(i = 0; content_array.length > i; i++){
	
			$(".article_list").append(
			
				"<li data-article_number='" + i + "'><h4>" + content_array[i][0] + "</h4><time class='meta'>" + content_array[i][3] + "</time><p>" + content_array[i][2] + "</p></li>");
	
		}
		
		$(".article_list li").click(function(){
		
			open_news($(this).attr("data-article_number"));
				
		});
	
	}
	
	/**
	 *	
	 *	AJAX Request to get game news from a server then rendering it behind a loader. 	
	 *
	 * 	1. Adds Loader anmation to the list. 
	 *
	 * 	2. AJAX request to the server that returns the xml
	 *
	 *	3. On suscessful AJAX finds the listed elemetns of
	 *	   the feed and saves them to the localstorage string.
	 *
	 * 	4. (Fallback) If the AJAX is unsucessful it loads the perviously loaded content to the list.
	 */			
	
	function getNews(){
		
		/* 1 */
		$(".article_list").html("<div class='loader'>Loading...</div><p id='news_loading_text'></p>");
		content_array.length = 0;
		
		$.ajax({
		    
		    /* 2 */   
	        type: "get",
	        url: "http://wearekiwikiwi.co.uk/feed/",
	        dataType: "xml",
	        success: function(data) {
	            
	            /* 3 */ 
	            $(".article_list").html("");
										
					var $XML = $(data);
					$XML.find("item").each(function() {
					
					var $this = $(this),
					item = {
					    title:       $this.find("title").text(),
					    link:        $this.find("link").text(),
					    description: $this.find("description").text(),
					    pubDate:     $this.find("pubDate").text(),
					    content:	 $this.find("encoded").text(),
					};
					
					var temp_array = [item.title,item.link,item.description,item.pubDate.substring(0, 16),item.content]; 
					
					content_array.push(temp_array);
					
					var temp_string = JSON.stringify(content_array);
					window.localStorage.setItem("ots_news_array",temp_string);
				 				            		        
			    });
	            
	            render_news();
	          
	        },
		    error: function(){ 
			
				/* 4 */
				$(".article_list").html("<div class='loader'>Loading...</div>");
			    $("#news_loading_text").html("Cannot Load News");
			    render_news();
			    
			}    
		});	
		
	}		
	
	/**
	 * Animates the closing of the navigation pane. 	
	 * 
	 */				
	
	function closeNav(){
		
		$('#NAV').animate({"left": '-25%'});
		$(".page").animate({"margin-left":"0"});
		$('.RETURN').css("display","none");
		
	}
	
	/**
	 * Aniamtes the opening of the navigation pane. 	
	 * 
	 */				
	 
	function openNav(){
		
		$('#NAV').animate({"left": '0'});
		$('.page').animate({"margin-left": "25%"});
		$('.RETURN').css("display","block");
		
	}
	
	/**
	 * Clears the localstorage element used by the news storage. 	
	 * 
	 */				
	
	function clear_app_data(){
		
		localStorage.removeItem('ots_news_array');
		
	}
	
	/**
	 *  	
	 * 
	 */				
	
	function render_user_data(){
		
		$("section.master_nav a:nth-child(1)").text("Player ID: " + player.player_id);
		$("#player nav#header h1").text("Player ID: " + player.player_id);
		
	}
	
	/**
	 *	
	 * 
	 */			

	function get_user_data(){
		
	    $.ajax({
		   
	        'async': false,
	        'global': false,
	        'url': "player_test_data.json",
	        'dataType': "json",
	        'success': function (temp_data) {
	            
	            settings = temp_data.settings;
	            player = temp_data.player;
	            story  = temp_data.story;
	            
	        }
	    });
	    
	    render_user_data();
		
	}
	
	/**
	 *	
	 * 
	 */
	 
	 function render_lore_data(){
		 
		 $(".lore").text(lore.meta.version);
		 
		 $(".lore").append(lore.ots.name);
		 
		 
	 }
	
	/**
	 *	
	 * 
	 */
	
	function get_lore_data(){
		
		$.ajax({
		   
	        'async': false,
	        'global': false,
	        'url': "game_guide.json",
	        'dataType': "json",
	        'success': function (temp_data) {
	            
	            lore = temp_data;
	            
	            console.log(lore);
	            
	        }
	    });
	    
	    render_lore_data();
		
	}		

	/**
	 *	PhoneGap onDevice Ready
	 * 
	 *	Function fires once phonegap has init the application. 
	 */			
	
	function onDeviceReady() {
		
	    $("#device").html("Device: " + device.model);
	
	}
	
	/**
	 *	
	 * 
	 */			
	
	$(document).ready(function(){
		
		document.addEventListener("deviceready", onDeviceReady, false);
		
		var hammertime = new Hammer(document.body);
		
		if(content_array === null){
	
			ots_news_array = [["","","","",""]];
			var str = JSON.stringify(ots_news_array);
			window.localStorage.setItem("ots_news_array",str);
			
		}
		
		// Click Detectors (Non Nav)
		
		$("#RETURN").click(			function(){	closeNav();			});
		$("a#NAVBTN").click(		function(){	openNav();			});
		$("#SYNC").click(			function(){	getNews();			});
		$("#NAV a").click(			function(){	closeNav();			});
		
		$("#close_btn").click(function() { close_news(); console.log("close fired");});
		
		// Navigation Click Detectors
		
		$("#news_button").click(		function(){window.location.href="#news"; 		closeNav();});
		
		$("#gameguide_button").click(	function(){window.location.href="#gameguide"; 	closeNav();});
		$("#player_button").click(	function(){window.location.href="#player"; 			closeNav();});
		$("#about_button").click(	function(){window.location.href="#about"; 			closeNav();});
		$("#settings_button").click(	function(){window.location.href="#settings"; 	closeNav();});
		
		
		
		hammertime.on('swipe', function(ev) {
		    
		    if(ev.direction === 4){
			    
			    openNav();
			    
		    }
		    else if(ev.direction === 2){
			    
			    closeNav();
			    
		    }
		   
		});
		
		get_lore_data();
		get_user_data();
		getNews();
		
		$(".clear_app_data").click(	function(){	
			
			navigator.notification.confirm("Clearing this will delete all localdata", clear_app_data);
			
		});
			

});