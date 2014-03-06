Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('home', {
        path: '/',
        template: 'home',
    });

    this.route('semesterList', {
        path: '/admin/semesters',
        template: 'semesterList',
        layoutTemplate: 'adminLayout',
        waitOn: function() {
            return this.subscribe('semesters');
        },
        data: function() {
            return {
                semesters: Semesters.find(),
            }
        }
    });


    this.route('adminSemesterEdit', {
        path: '/admin/semester/:_id',
        template: 'adminSemesterEdit',
        layoutTemplate: 'adminLayout',
        waitOn: function() {
            return [
                this.subscribe('semester', this.params._id),
                this.subscribe('semesterCourses', this.params._id)
            ];
        },
        data: function() {
            return {
                semester: Semesters.findOne(),
                courses: Courses.find(),
            }
        },
    });


    /*  ------------------------------------------------------------------------
        Courses
        -----------------------------------------------------------------------*/
    this.route('adminCourseEdit', {
        path: '/admin/course/edit/:_id',
        template: 'adminCourseEdit',
        layoutTemplate: 'adminLayout',
        waitOn: function() {
            return this.subscribe('courseWithSemester', this.params._id)
        },
        data: function() {
            return {
                course: Courses.findOne(),
                semester: Semesters.findOne(),
            }
        }
    });



    this.route('adminUserEdit', {
        path: '/admin/user/edit/:_id',
        template: 'adminUserEdit',
        layoutTemplate: 'adminLayout',
        waitOn: function() {
            return Meteor.subscribe('singleUser', this.params._id);
        },
        data: function() {
            return {
                targetUser: Meteor.users.findOne(this.params._id),
                roles: Meteor.roles.find(),
            }
        }
    });

    this.route('adminUserList', {
        path: '/admin/users',
        template: 'adminUserList',
        layoutTemplate: 'adminLayout',
        waitOn: function() {
            return Meteor.subscribe('allUsers');
        },
        data: function() {
            Meteor.users.find().forEach(function(user) {
                console.log(user)
            })
            return {
                users: Meteor.users.find(),
            }
        }
    });

    this.route('adminHome', {
        path: '/admin',
        template: 'adminDashboard',
        layoutTemplate: 'adminLayout',
        waitOn: function() {
            return [
                Meteor.subscribe('allUsers'),
                Meteor.subscribe('semesters')
            ];

        }
    });

    this.route('profile', {
        path: '/profile/:_id',
        template: 'profileEdit',
        data: function() {
            return { user: Meteor.user() };
        }, 
    })


});