



if (Meteor.isServer) {

    Meteor.startup(function() {

        // Semesters.remove({});
        // Courses.remove({});
        if (Semesters.find().count() == 0) {
            for (var i=0; i<4; i++) {
                Semesters.insertSemester({title: "Test Semester " + i});
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

    Meteor.methods({
        activateSemester: function(semester_id) {
            Semesters.update({active:true},{$set: {active:false}},{multi:true});
            Semesters.update(semester_id, {$set: {active: true}});
        }
    })


    Meteor.publish("semesters", function() {
        return Semesters.find();
    });
    Meteor.publish("semester", function(_id) {
        return Semesters.find(_id);
    });
    Meteor.publish("semesterBySlug", function(slug) {
        var semesterCur = Semesters.find({slug: slug});
        var semester = Semesters.findOne({slug: slug});
        var semester_id = (semester) ? semester._id : undefined;
        return [
            semesterCur,
            Courses.find({semester_id: semester_id}),
        ];
    })
    Meteor.publish("semesterCourses", function(semesterId) {
        return Courses.find({semester_id: semesterId});
    })
    Meteor.publish("courseWithSemester", function(id) {
        // the naive approach is good enough here
        var courseCursor = Courses.find({_id: id}, {sort: {index:1}});
        var semester_id = Courses.findOne({_id: id}).semester_id;
        return [
            courseCursor, 
            Semesters.find({_id: semester_id})
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
}