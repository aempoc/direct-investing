(function () { 'use strict'; angular.module('tdctRedesign', ['tdct', 'ngCookies','ngAria'],function config($ariaProvider) {
    $ariaProvider.config({
            ariaHidden:false
        });
    });
})();
(function () {
    'use strict';
    /**
     * TDCT Redesign Investing Controller Start
    */
    angular.module('tdctRedesign').controller('tdctRedesignController', tdctRedesignController);
    tdctRedesignController.$inject = ['$scope', '$rootScope', '$http', '$cookies', '$timeout', '$compile', '$window', '$location'];

    function tdctRedesignController($scope, $rootScope, $http, $cookies, $timeout, $compile, $window, $location) {
        var vm = this;

        /* Functions */
        vm.init = init;
		vm.appendCookie = appendCookie;
        vm.checkRecent = checkRecent;
        vm.setCard = setCard;
		
        /* constants */
        vm.lang = "en";
        vm.userInit = null;
        vm.error = '';
        vm.login = false;
        vm.logout = false;
        init();

        function init() {
            //Set language Constant
            if (window.conTextPathVal != undefined || window.conTextPathVal != "") {
                vm.lang = window.conTextPathVal.split('/')[2];
            }

            //Login
            var xhttp = new XMLHttpRequest($cookies);
            var isCookie = $cookies.get("infositeCookie");
            var tempInfositeUrl = infositeUrl + "?x=" + $.now();
            if(isCookie == null){
                if (window.env.toLowerCase() != "stg") { //Required to avoid calling in staging website
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4) {
                            vm.login=true;
                            vm.logout=false;
                            $scope.$digest();
                            if(this.status==200)
                            {
                                var tempResponse = this.responseText.trim();
                                var cookieArr=[];
                                cookieArr=JSON.parse(tempResponse);
                                angular.forEach(cookieArr, function(value, key) {
                                        if(key=="infositeCookie"||key=="omSessionID"){
                                            document.cookie = key+"="+value+ ";domain=.td.com;path=/;";
                                        }
                                });
                                if($cookies.get('infositeCookie')!=null){
                                        vm.login=false;
                                        vm.logout=true;
                                        $scope.$digest();
                                        OmniOnloadTrigger();
                                }
                            }
                        }
                    };
                    xhttp
                        .open(
                            "GET",
                            tempInfositeUrl,
                            true);
                    xhttp.withCredentials = true;
                    xhttp.send();
                } else{
                    vm.login=true;
                    vm.logout=false;
                }
            } else{
                vm.login=false;
                vm.logout=true;
                OmniOnloadTrigger();
            }
       }
	   
	   function setCard(cardId,cardType){
            if(maxRecentlyViewed>0){
                var cookieValue=appendCookie(cardId,cardType);
                if(cookieValue!=null){
                    var d = new Date();
                    d.setTime(d.getTime() + (365*24*60*60*1000));
                    var expires = "expires="+ d.toUTCString();
                    document.cookie = "RecentItems="+ cookieValue+ ";path="+conTextPathVal+";expires="+expires;
                }
            }
        }
		
        function appendCookie(cardId, cardType) {
            var cookieValue = $cookies.get('RecentItems');
            if (cookieValue != null) {
                var items = getCardTypeElements(cookieValue, cardType);
                if (items != null) {
                    var cardArr = getItemArrayList(items);
                    if (!isCardExist(cardArr, cardId)) {
                        var updatedItems = '';
                        if(cardArr.length<maxRecentlyViewed+1) {
                            for (var i = 0; i < cardArr.length; i++) {
                                updatedItems = updatedItems + cardArr[i] + '|';
                            }
                            updatedItems = updatedItems + cardId + '|';
                        }
                        else if(cardArr.length==maxRecentlyViewed+1) {
                            for (var i=1;i<cardArr.length-1;i++)
                                cardArr[i]=cardArr[i+1];
                            cardArr[cardArr.length-1]=cardId;
                            for (var i = 0; i < cardArr.length; i++) {
                                updatedItems = updatedItems + cardArr[i] + '|';
                            }
                        }
                        cookieValue = cookieValue.replace(items, updatedItems);
                    }
                } else {
                    cookieValue = cookieValue + cardType + '|' + cardId + '|||';
                }
            } else {
                cookieValue = cardType + '|' + cardId + '|||';
            }
            return cookieValue;
        }

        function checkRecent(elementId, cardId, cardType) {
            var cookieValue = $cookies.get('RecentItems');
            if (cookieValue != null) {
                var items = getCardTypeElements(cookieValue, cardType);
                if (items != null) {
                    var cardArr = getItemArrayList(items);
                    if (isCardExist(cardArr, cardId)) {
                        var  pos='left';
                        $("#" + elementId).find(".td-indicator-recently-viewed").addClass(pos).addClass("show");
                    }
                }
            }
        }

        function getCardTypeElements(cookieValue, cardType) {
            if (cookieValue.indexOf(cardType) != -1) {
                var startIndex = cookieValue.indexOf(cardType);
                var endIndex = cookieValue.indexOf('|||', startIndex);
                var items = cookieValue.substring(startIndex, endIndex) + '|';
                return items;
            }
            return null;
        }

        function getItemArrayList(items) {
            var cardArr = [];
            while (items != '') {
                cardArr.push(items.substring(0, items.indexOf('|')));
                items = items.replace(items.substring(0, items.indexOf('|') + 1), '');
            }
            return cardArr;
        }

        function isCardExist(cardArr, cardId) {
            for (var i = 0; i < cardArr.length; i++) {
                if (cardArr[i] == cardId)
                    return true;
            }
            return false;
        }
    }
})();