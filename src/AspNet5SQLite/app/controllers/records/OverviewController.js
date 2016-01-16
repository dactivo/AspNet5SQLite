/* global $ */
(function () {
	'use strict';

	var module = angular.module("mainApp");

	// this code can be used with uglify
	module.controller("OverviewController",
		[
			"$scope",
			"$log",
			"dataEventRecords",
			"DataEventRecordsService",
			OverviewController
		]
	);

	function OverviewController($scope, $log, dataEventRecords, DataEventRecordsService) {
		$log.info("OverviewController called");
		$scope.message = "Overview";
		$scope.DataEventRecordsService = DataEventRecordsService;

		$log.info(dataEventRecords);
		$scope.dataEventRecords = dataEventRecords;
	
	
		$scope.Delete = function (id) {
		    $log.info("deleting");
		    $scope.DataEventRecordsService.DeleteDataEventRecord(id).then(
				function(){
				$scope.$emit('reloadingrecords', "record deleted");
    		});
		
		
		};
		
		$scope.$on('reloadingrecords', function(event, data) 
		{
			reload(data);
		});
	
	
		
		/*	$scope.$on('$stateChangeStart', function(event, toState, toParams,    fromState, fromParams)
			{
					reload();
			});
			*/
		
		function reload(msg)
		{
			$scope.$parent.mensajeoperacion=msg;
			DataEventRecordsService.GetDataEventRecords().then(function(results) {
       		$log.info("reloading");
			$scope.dataEventRecords=results;
			$log.info(results);
			});
		}
		
		
	}
})();
