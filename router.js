Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('home', {
        path: '/',
        template: 'home',
    });

    this.route('sessionList', {
        path: '/admin/sessions',
        template: 'sessionList',
        layoutTemplate: 'adminLayout',
        waitOn: function() {
            return this.subscribe('sessions');
        },
        data: function() {
            return {
                sessions: Sessions.find(),
            }
        }
    });


    this.route('adminSessionEdit', {
        path: '/admin/session/:_id',
        template: 'adminSessionEdit',
        layoutTemplate: 'adminLayout',
        waitOn: function() {
            return [
                this.subscribe('session', this.params._id),
                this.subscribe('sessionCourses', this.params._id)
            ];
        },
        data: function() {
            return {
                session: Sessions.findOne(), 
                courses: Courses.find(),
            }
        },
        before: [
            function() {
                Session.set('showAddCourse', false);
            }
        ]
    });


    /*  ------------------------------------------------------------------------
        Courses
        -----------------------------------------------------------------------*/
    this.route('adminCourseEdit', {
        path: '/admin/course/edit/:_id',
        template: 'adminCourseEdit',
        layoutTemplate: 'adminLayout',
        waitOn: function() {
            return this.subscribe('courseWithSession', this.params._id)
        },
        data: function() {
            return {
                course: Courses.findOne(),
                session: Sessions.findOne(),
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
            return Meteor.subscribe('allUsers');
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