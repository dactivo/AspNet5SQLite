(function () {
    var mainApp = angular.module("mainApp", ["ui.router"]);

    mainApp.config(["$stateProvider", "$urlRouterProvider",
		function ($stateProvider, $urlRouterProvider) {
		    $urlRouterProvider.otherwise("/home/overview");

		    $stateProvider
                .state("home", { abstract: true, url: "/home", templateUrl: "/templates/home.html" })
                    .state("overview", {
                        parent: "home", url: "/overview", templateUrl: "/templates/records/index.html", controller: "OverviewController",
                        resolve: {

                            DataEventRecordsService: "DataEventRecordsService",

                            dataEventRecords: ["DataEventRecordsService", function (DataEventRecordsService) {
                                return DataEventRecordsService.GetDataEventRecords();
                            }]
                        }
                    })
                    .state("details", {
                            parent: "overview", url: "/details/:id", templateUrl: "/templates/records/details.html", controller: "DetailsController",
                            resolve: {
                                DataEventRecordsService: "DataEventRecordsService",

                                dataEventRecord: ["DataEventRecordsService", "$stateParams", function (DataEventRecordsService, $stateParams) {
                                    var id = $stateParams.id;
                                    console.log($stateParams.id);
                                    return DataEventRecordsService.GetDataEventRecord({ id: id });
                                }]
                            }
                    })
                    .state("create", {
                        parent: "overview", url: "/create", templateUrl: "/templates/records/create.html", controller: "DetailsController",
                        resolve: {
                            dataEventRecord: [ function () {
                                return { Name: "", Description: "", Timestamp: "2015-08-28T09:57:32.4669632" };
                            }]
                            
                        }
                    })
		}
    ]
    );

    mainApp.run(["$rootScope", function ($rootScope) {
       
       /* $rootScope.$on('$viewContentLoaded', function() {
            $templateCache.removeAll();
        }); */
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log(event);
            console.log(toState);
            console.log(toParams);
            console.log(fromState);
            console.log(fromParams);
            console.log(error);
        })

        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            console.log(event);
            console.log(unfoundState);
            console.log(fromState);
            console.log(fromParams);
        })

    }]);

})();
(function () {
	'use strict';

	var module = angular.module('mainApp');

	// this code can be used with uglify
	module.controller('DetailsController',
		[
			'$scope',
			'$log',
			'dataEventRecord',
            'DataEventRecordsService',
            '$state',
			DetailsController
		]
	);

	function DetailsController($scope, $log, dataEventRecord, DataEventRecordsService, $state) {
		$log.info("DetailsController called");
		$scope.message = "dataEventRecord Create, Update or Delete";
	    $scope.DataEventRecordsService = DataEventRecordsService;
	    $scope.state = $state;

		$scope.dataEventRecord = dataEventRecord;

		$scope.Update = function() {
		    $log.info("Updating");
		    $log.info(dataEventRecord);
		    $scope.DataEventRecordsService.UpdateDataEventRecord(dataEventRecord);
			$scope.$parent.mensajeoperacion="record actualizado";
		    $scope.state.go("overview");
		};

		$scope.Create = function () {
		    $log.info("Creating");
		    $log.info(dataEventRecord);
		    $scope.DataEventRecordsService.AddDataEventRecord(dataEventRecord).then
			{
					$scope.$emit('reloadingrecords', "record added");
				$scope.state.go("overview");
			}
		    
		};

	}

})();

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

(function () {
    'use strict';

    function DataEventRecordsService($http, $log, $q) {
        $log.info("DataEventRecordsService called");

	    var AddDataEventRecord = function (dataEventRecord) {
	        var deferred = $q.defer();

	        console.log("addDataEventRecord started");
	        console.log(dataEventRecord);

	        $http({
	            url: 'api/DataEventRecords',
	            method: "POST",
	            data: dataEventRecord
	        }).success(function (data) {
	            deferred.resolve(data);
	        }).error(function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
	    };

	    var UpdateDataEventRecord = function (dataEventRecord) {
	        var deferred = $q.defer();

	        console.log("addDataEventRecord started");
	        console.log(dataEventRecord);

	        $http({
	            url: 'api/DataEventRecords/' + dataEventRecord.Id,
	            method: "PUT",
	            data: dataEventRecord
	        }).success(function (data) {
	            deferred.resolve(data);
	        }).error(function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
	    };

	    var DeleteDataEventRecord = function (id) {
	        var deferred = $q.defer();

	        console.log("DeleteDataEventRecord begin");
	        console.log(id);

	        $http({
	            url: 'api/DataEventRecords/' + id,
	            method: "DELETE",
	            data: ""
	        }).success(function (data) {
	            deferred.resolve(data);
	        }).error(function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
	    };

	    var GetDataEventRecords = function () {
            var deferred = $q.defer();

	        $log.info("DataEventRecordService DataEventRecords called");
	        $http({
				url:"/api/DataEventRecords",
				cache:false,
				method:"GET"
			}
				)
			.then(function (response) {
				deferred.resolve(response.data);
			    
			});
			
			console.log("devuelve en función get");
			        return deferred.promise;
	    }

	    var GetDataEventRecord = function (id) {
	        $log.info("DataEventRecordService GetDataEventRecord called: " + id.id);
	        $log.info(id);
	        return $http.get("/api/DataEventRecords/" + id.id)
			.then(function (response) {
			    return response.data;
			});
	    }


		return {
		    AddDataEventRecord: AddDataEventRecord,
		    UpdateDataEventRecord: UpdateDataEventRecord,
		    DeleteDataEventRecord: DeleteDataEventRecord,
		    GetDataEventRecords: GetDataEventRecords,
		    GetDataEventRecord: GetDataEventRecord
		}
	}

	var module = angular.module('mainApp');

	// this code can be used with uglify
	module.factory("DataEventRecordsService",
		[
			"$http",
			"$log",
            "$q",
			DataEventRecordsService
		]
	);

})();
