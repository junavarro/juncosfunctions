const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions



function tabularSportLabels(singleEvent){
    var  labels={
        'top_left' : 'top_left',
        'top_center' : 'top_center',
        'top_right' : 'top_right',
        'bottom_left' : 'bottom_left',
        'bottom_cleft' : 'bottom_cleft',
        'bottom_center' : 'bottom_center',
        'bottom_cright' : 'bottom_cright',
        'bottom_right' : 'bottom_right'
    }
    
    return  labels;

}

exports.updateEventsLabels = functions.firestore
    .document('single-event/{singleEventId}')
    .onWrite((change, context) => {
        const singleEvent = change.after.data();
        const disciplineKey = singleEvent.discipline.disciplineKey;
        
        //update labels for football, indoor football, volleyball, basketball, pingpong
        if  (disciplineKey === 'basketball' ||  
            disciplineKey === 'football' || 
            disciplineKey === 'indoorfootball' ||
            disciplineKey === 'pingpong' ||
            disciplineKey === 'volleyball'){

            var eventTime =  new Date(singleEvent.date);
            var eventHour = eventTime.getUTCHours()+6 < 10 ? '0'+ eventTime.getHours()+6 : eventTime.getHours()+6 ;
            var eventMinute = eventTime.getMinutes() < 10 ? '0' + eventTime.getMinutes(): eventTime.getMinutes();
            var timeTag = eventHour > 11 ? 'pm':'am';
            

        
            var top_left = `${eventHour} : ${eventMinute} ${timeTag}`;
        
            var top_center = singleEvent.hit.displayName;
            var top_right = singleEvent.branch.displayName;
        
            var bottom_left = singleEvent.data[0].list[0].headers[0].displayText;
            var bottom_cleft = singleEvent.data[0].list[0].points[0].displayData;
        
            var bottom_center = '-';
            
            var bottom_cright = singleEvent.data[0].list[0].points[1].displayData;
            var bottom_right = singleEvent.data[0].list[0].headers[1].displayText;
            var labels={
                'top_left' : top_left,
                'top_center' : top_center,
                'top_right' : top_right,
                'bottom_left' : bottom_left,
                'bottom_cleft' : bottom_cleft,
                'bottom_center' : bottom_center,
                'bottom_cright' : bottom_cright,
                'bottom_right' : bottom_right
            };
            console.log(labels);
        } else {
            //labels = tabularSportLabels(change);           
        }

        return change.after.ref.set({
            'labels': labels
        }, {merge: true});
});
