﻿/* global angular */
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
