(function() {
  'use strict';

  angular
    .module('colourTest')
    .config(storageConfig);

  function storageConfig(localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('colourMemory')
      .setNotify(true, true);
  }
})();
