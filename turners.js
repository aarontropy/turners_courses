



if (Meteor.isServer) {

    Meteor.startup(function() {

        if (Sessions.find().count() == 0) {
            for (var i=0; i<4; i++) {
                Sessions.insert({title: "Test Session " + i});
            }
        }

        if (Roles.getAllRoles().count()==0) {
            Roles.createRole('administrator');
            Roles.createRole('instructor');
        }

        superAdmin = Meteor.users.findOne({username: 'admin'});
        if (!superAdmin) {
            superAdmin = Accounts.createUser({
                username: 'admin',
                email: 'admin@example.com',
                password: 'superadmin',
                profile: {name: "The Super-Duper Administrator"}
            });
        }
        if (!Roles.userIsInRole(superAdmin, ['administrator'])) {
            Roles.addUsersToRoles(superAdmin, ['administrator']);
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
        var courseCursor = Courses.find({_id: id}, {sort: {index:1}});
        var session_id = Courses.findOne({_id: id}).session_id;
        return [
            courseCursor, 
            Sessions.find({_id: session_id})
        ];
    })
    Meteor.publish("singleUser", function(userId) {
        return Meteor.users.find(userId);
    });
    Meteor.publish("allUsers", function() {
        return Meteor.users.find();
    });

    Meteor.publish(null, function(){
        return Meteor.roles.find({});
    });

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
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_EMAIL'
    })
    

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

}