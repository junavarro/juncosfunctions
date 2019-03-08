const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions




exports.updateEventsLabels = functions.firestore
    .document('single-event/{singleEventId}')
    .onWrite((change, context) => {
        const singleEvent = change.after.data();
        const disciplineKey = singleEvent.discipline.disciplineKey;
        
        var labels = {};

        var eventTime =  new Date(singleEvent.date);
        var eventHour = eventTime.getUTCHours() < 10 ? '0'+ eventTime.getUTCHours() : eventTime.getUTCHours() ;
        var eventMinute = eventTime.getMinutes() < 10 ? '0' + eventTime.getMinutes(): eventTime.getMinutes();
        var timeTag = eventHour > 11 ? 'pm':'am';
        //for all disciplines
        labels['top_left'] = `${eventHour}:${eventMinute} ${timeTag}`;
        labels['top_center'] = singleEvent.hit.displayName;
        labels['top_right'] = singleEvent.branch.displayName;
        //update labels for football, indoor football, volleyball, basketball, pingpong
        if  (disciplineKey === 'basketball' ||  
            disciplineKey === 'football' || 
            disciplineKey === 'indoorfootball' ||
            disciplineKey === 'pingpong' ||
            disciplineKey === 'volleyball'){

            labels['bottom_left'] = singleEvent.data.team_a.displayName;

            labels['bottom_cleft'] = singleEvent.data.team_a.score.mainScore;
            labels['bottom_center'] = '-';
            labels['bottom_cright'] = singleEvent.data.team_b.score.mainScore;
            labels['bottom_right'] = singleEvent.data.team_b.displayName;
        
            console.log(labels);
        } else  {//update labels for athletics, swimming, taekwondo, karate               
            labels['center_center']  = singleEvent.discipline.category;               
            console.log(labels);                
        }

        return change.after.ref.set({
            'labels': labels
        }, {merge: true});
});
