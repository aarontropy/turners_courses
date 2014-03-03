
if (Meteor.isServer) {
    Meteor.startup(function() {
        if (Sessions.find().count() == 0) {
            for (var i=0; i<4; i++) {
                Sessions.insert({title: "Test Session " + i});
            }
        }
    });


    Meteor.publish("sessions", function() {
        return Sessions.find();
    });
    Meteor.publish("session", function(id) {
        return Sessions.find({_id: id });
    })
    Meteor.publish("sessionCourses", function(sessionId) {
        return Courses.find({session_id: sessionId});
    })
    Meteor.publish("courseWithSession", function(id) {
        // the naive approach is good enough here
        var courseCursor = Courses.find({_id: id});
        var session_id = Courses.findOne({_id: id}).session_id;
        return [
            courseCursor, 
            Sessions.find({_id: session_id})
        ];
    })

}

colorList = [
'#FF0000',
'#FFCE00',
'#3216B0',
'#00CC00',
'#BF3030',
'#BFA430',
'#3D2D84',
'#269926',
'#A60000',
'#A68600',
'#1B0773',
'#008500',
'#FF4040',
'#FFDA40',
'#644AD8',
'#39E639',
'#FF7373',
'#FFE473',
'#8370D8',
'#67E667',
]


if (Meteor.isClient) {

    Handlebars.registerHelper('colorList', function(index) {
        return colorList[index % colorList.length];
    })

    Template.courseEdit.helpers = {
        session_id: function() {
            course = Courses.findOne();
            if (course) {
                return course.session_id;
            } else {
                return
            }
        }
    }
    
    Template.courseAdd.events = {
        'click #saveCourse': function() {
            Courses.insert({
                title: $('#courseTitle').val(),
                session_id: this.session._id,
            });
            Router.go('sessionDetail', {_id: this.session._id});
        }
    }

    Template.courseEdit.events = {
        'click #saveCourse': function() {
            Courses.update(this._id, {$set: {
                title: $('#courseTitle').val(),
            }});
            Router.go('sessionDetail', {_id: this.session_id});
        }
    }


    Session.setDefault('showAddCourse', false);
    Template.adminSessionEdit.helpers({
            showAddCourse: function() {
                return Session.get('showAddCourse');
            },
        })

    Template.adminSessionEdit.events({
            'click #btnAddCourse': function(event) {
                Session.set('showAddCourse', true);
            },
            'click .btnEditCourse': function(event) {
                Router.go('adminCourseEdit', {_id: this._id});
            },
            'click .btnDeleteCourse': function(event) {
                console.log("removing " + this.title);
            }
        })

    Template.sessionCourseAddModal.events({
        'click .closeModal': function(event) {
            Session.set('showAddCourse', false);
        },
        'click #save': function(event, tmpl) {
            insertCourse({
                title: tmpl.find('input#courseTitle').value,
                index: Courses.find().count(),
                session_id: this.session._id,
                rule: {
                    days: [
                        tmpl.find('input#courseSun').checked,
                        tmpl.find('input#courseMon').checked,
                        tmpl.find('input#courseTue').checked,
                        tmpl.find('input#courseWed').checked,
                        tmpl.find('input#courseThu').checked,
                        tmpl.find('input#courseFri').checked,
                        tmpl.find('input#courseSat').checked,
                    ],
                    weeks: tmpl.find('input#courseWeeks').value,
                }
            });
            Session.set('showAddCourse', false);
        },
    })


    Template.adminCourseEdit.helpers({
        meetings: function() {
            return courseRRule(this.course).all();
        }
    })

    Template.adminCourseEdit.events({
        'click #btnMeetings': function(event) {
            rule = courseRRule(this.course);

            console.log(rule)
        }
    })


    var courseRRule = function(course) {
        var wds = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];
        var byweekday = _.filter(wds, function(wd, idx) { return course.rule.days[idx]; });
        var count = byweekday.length * (course.weeks || 6);
        
        return new RRule({
            freq: RRule.WEEKLY,
            byweekday: byweekday,
            count: count,
        });

    }

    var insertCourse = function(course) {
        // console.log(course);
        Courses.insert(course);
    }




    // ---- ClassEdit ----------------------------------------------------------
    // Template.courseEdit.helpers({
    //     course: function() { return Courses.findOne(); }
    // });

}