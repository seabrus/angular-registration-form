var app = angular.module('nTest', []);

app.controller('nTestController', [ 'DataService', function( DataService ) {
	var self = this;

// Application data
	self.regData = DataService.getData();
    self.paymentMethods = DataService.getPaymentMethods();
    self.subscriptionPlans = DataService.getSubscriptionPlans();

// Tab selection
    self.currentTab = "Basics";

// User profile data saving
    self.savingResult = [ '' ];   // 'success' or 'error'
    self.saveUserProfile = function( result ) { DataService.saveUserProfileData( result ); };


// Opening hours timetable visibility
	self.showHours = false;
	self.getHoursClass = function() {
        var yes = (self.showHours === false);
        return {
            showHours: yes,
            hideHours: !yes
        };
    };

//===============================================
//     Add / Delete time spans
//===============================================
	self.addTimeSpan = function( dayName, tsFrom, tsUntil ) {
        // Find the active day of the week
		for ( var i=0, len1=self.regData.openingHours.length; i<len1; i++ )
			if ( dayName === self.regData.openingHours[ i ].dayName ) break;

        // Find the active time span
        var selectedDay = self.regData.openingHours[ i ];
		for ( var j=0, len2=selectedDay.hours.length; j<len2; j++ )
			if ( tsFrom === selectedDay.hours[ j ].from  &&  tsUntil === selectedDay.hours[ j ].until ) break;

        // Add a new time span after the active one  OR  the first one into an empty array of time spans  
		if ( j < len2  ||  len2 === 0 ) {
			var buf = {from: '', until: ''};
			selectedDay.hours.splice( j+1, 0, buf );
		}
	};

	self.deleteTimeSpan = function( dayName, tsFrom, tsUntil ) {
        // Find the active day of the week
		for ( var i=0, len1=self.regData.openingHours.length; i<len1; i++ )
			if ( dayName === self.regData.openingHours[ i ].dayName ) break;

        // Find the active time span
        var selectedDay = self.regData.openingHours[ i ];
		for ( var j=0, len2=selectedDay.hours.length; j<len2; j++ )
			if ( tsFrom === selectedDay.hours[ j ].from  &&  tsUntil === selectedDay.hours[ j ].until ) break;

        // Delete the active time span
		if ( j < len2 )
			selectedDay.hours.splice( j, 1 );
	};

}]);


app.factory('DataService', [ '$http', function( $http ) {

	var regData = {
        restaurantName: '',
        motto: '',
        address: '',
        wifiName: '',
        wifiPassword: '',
        foundedAt: '',
        openingHours: [
          { dayName: 'Monday', hours: [ {from: '9:00', until: '12:30'}, {from: '14:00', until: '18:30'}, {from: '19:00', until: '23:30'} ] },
          { dayName: 'Tuesday', hours: [  ] },
          { dayName: 'Wednesday', hours: [ {from: '', until: ''} ] },
          { dayName: 'Thursday', hours: [ {from: '', until: ''} ] },
          { dayName: 'Friday', hours: [ {from: '', until: ''} ] },
          { dayName: 'Saturday', hours: [ {from: '', until: ''} ] },
          { dayName: 'Sunday', hours: [ {from: '', until: ''} ] }
        ],

        subscriptionPlan: 'Business plan',

        ownerName: '',
        regRecord: '',
        contactManager: { nAccount: '', fullName: '', email: '' },

        billingName: '',
        street1: '',
        street2: '',
        city: '',
        postCode: '',
        country: '',
        paymentMethod: 'PayPal'
	};

    //var paymentMethods = [ { name: 'Bank transfer' }, { name: 'PayPal' }, { name: 'Credit card' } ];
    var paymentMethods = [ 'Bank transfer', 'PayPal', 'Credit card'  ];

    var subscriptionPlans =  [ 
        { name: 'Basic plan', style: 'panel-default', description: 'A plan just to test Naible' }, 
        { name: 'Business plan', style: 'panel-success', description: 'This plan is selected by the most restaurants' }, 
        { name: 'Advanced plan', style: 'panel-info', description: 'A plan for restaurant networks' } 
    ];


    return   { 
        getData: function() { return regData; }, 
        getPaymentMethods: function() { return paymentMethods; }, 
        getSubscriptionPlans: function() { return subscriptionPlans; },

        saveUserProfileData:  function( result ) { 
            $http.post( '/profile', regData )
                .success( function() { result[0] = 'success'; } )
                .error( function() { result[0] = 'error'; } );
        }

    };

}]);


app.directive('openingHoursDirective', [ function() {
    return {
                templateUrl: 'views/opening-hours.html',
                restrict: 'A'
   };
}]);







