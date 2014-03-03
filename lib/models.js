Sessions = new Meteor.Collection("sessions");



Courses = new Meteor.Collection("courses");
Courses.allow({
	insert: function(userId, doc) {
		// Require that the course has an index and a session_id
		return doc.index !== undefined && doc.session_id
	},
	update: function(userId, doc) {
		return true;
	},
});


// courseRRule = function(course) {
//     if (course.rule) {
//         var wds = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];
//         var byweekday = _.filter(wds, function(wd, idx) { return course.rule.days[idx]; });
//         var count = byweekday.length * (course.weeks || 6);
        
//         return new RRule({
//             freq: RRule.WEEKLY,
//             byweekday: byweekday,
//             count: count,
//         });        
//     }

// }

courseMeetings = function(course) {
    var meetings = [];

    if (course.rule) {
        var wds = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];
        var byweekday = _.filter(wds, function(wd, idx) { return course.rule.days[idx]; });
        
        var rule =  new RRule({
            freq: RRule.WEEKLY,
            byweekday: byweekday,
            count: course.rule.count,
        });

        _.each(rule.all(), function(date, idx) {
            meetings.push({
                id: course._id + "_" + idx,
                title: course.title,
                start: date,
                color: colorList[course.index % colorList.length]
            });
        });
    }
    return meetings;

}

insertCourse = function(course) {
    console.log(course)
    var lastCourse = Courses.findOne({session_id: course.session_id}, {sort: {index: -1}});
    if (lastCourse) {
        course.index = lastCourse.index + 1;
    } else {
        course.index = 0;
    }
    Courses.insert(course);
}




Meetings = new Meteor.Collection("meetings");
