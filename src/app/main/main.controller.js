(function() {
  'use strict';
  /*global $ */
  /*jshint -W030 */

  angular
    .module('colourTest')
    .controller('MainController', MainController, ['Shuffler']);

  /** @ngInject */
  function MainController($timeout, $window, webDevTec, toastr, $log, Shuffler,localStorageService) {
    this.colours = ['red','red',
                    'yellow','yellow',
                    'green','green',
                    'teal','teal',
                    'blue','blue',
                    'purple','purple',
                    'pink','pink',
                    'orange','orange'];
    
    new Shuffler(this.colours);
    
    this.numColours = function(className) {
      return $window.document.getElementsByClassName(className).length;
    };
    
    this.addSelected = function(event){
      $(event.currentTarget).addClass('selected');
    };
    
    this.correct = 0;    
    this.wrong = 0;
    this.score = this.correct - this.wrong;

    this.toggle = function(){
      var result = this.enabled = !this.enabled;
      return result;
    };
    
    this.scoreTable = function(){
      var result = this.show = !this.show;
      return result;
    };

    this.scoreData = [{}];
    this.scoreSubmit = [{scoreName: ''}];
    
    this.submitForm = function(){
      $log.debug('[Colour Memory: Storing Score]');
      $log.debug('Storing:',this.scoreSubmit.scoreName,this.correct - this.wrong);
      var scoreName = this.scoreSubmit.scoreName;
      this.scoreSubmit.scoreName = '';
      return localStorageService.set(scoreName,this.correct - this.wrong);
    };
    
    this.retrieveData = function(){
      $log.debug('[Colour Memory: Retrieving Scores]');
      var storedScores = localStorageService.keys();
      var tempArray = [];
      storedScores.forEach(function(name){
        tempArray.push({'name': name, 'score':localStorageService.get(name)});
      });
      
      tempArray.sort(function(a, b) {
        return b.score - a.score;
      });
      
      this.scoreData  = tempArray;
    };
    
    this.deleteData = function(){
      $log.debug('[Colour Memory: Deleting Scores]');
      return localStorageService.clearAll();
    };
    
    this.checkPair = function(){
      var cardColor = [];
      $('.selected').each(function(){
        cardColor.push($(this).text());
      });

      if (cardColor.length === 2) {
        if(cardColor[0] === cardColor[1]){
          $log.debug('Removing and resetting selected cards');
          cardColor = [];
          this.correct+=1;
          
          $('ul').addClass('no-click');
          $('.selected').each(function(index, element){
            $timeout(function(){
              $(element).addClass('disabled').removeClass('selected');
              $timeout(function(){
                $('ul').removeClass('no-click');
              },300);
            },500);
          });
          
        } else {
          $log.debug('Resetting selected cards');
          cardColor = [];
          this.wrong+=1;
          
          $('ul').addClass('no-click');
          $('.selected').each(function(index, element){
            $timeout(function(){
              $(element).blur().removeClass('selected');
              $timeout(function(){
                $('ul').removeClass('no-click');
              },300);
            },500);
          });
        }
      }      
    };
    
    this.restartGame = function(){
      $log.debug('[Colour Memory: Restarting]');
      
      $('.disabled').each(function(index, element){
        $(element).removeClass('disabled');
      });
      
      this.colours = new Shuffler(this.colours);
      this.correct = 0;
      this.wrong = 0;
      this.enabled = '';
      this.show = '';
      this.$apply;
    };
    
  }
})();
