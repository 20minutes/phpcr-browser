define([
    'angular'
], function (angular) {
    'use strict';

    /**
     *
     * @param {$scope} $scope
     * @constructor
     */
    function RepositoryController($scope, $state, $graph, $search, $fuzzyFilter, $notify) {
        this.$scope = $scope;
        this.$state = $state;
        this.$graph = $graph;
        this.$search = $search;
        this.$fuzzyFilter = $fuzzyFilter;
        this.$notify = $notify;

        this.$$init();
    }

    RepositoryController.prototype.$$init = function() {
        var self = this;

        this.search = null;

        this.$scope.isWorkspaceCreationFormDisplayed = false;
        this.$scope.workspaceCreationForm = {
            name: null
        };

        this.workspaces = {};
        this.$$loadWorkspaces();

        this.cancelSearchListener = this.$search.registerListener(function(search) {
            if (self.search !== search) {
                self.search = search;
                self.$$filterWorkspaces();
            }
        });

        this.$scope.$on('$destroy', function() {
            self.$$destroy();
        });

        this.$scope.$on('$elementDropSuccess', function($event, data) {
            if (!data.draggableData.workspace && !data.droppableData.trash) {
                return;
            }

            return self.$$removeWorkspace(data.draggableData.workspace);
        });
    };

    RepositoryController.prototype.$$loadWorkspaces = function(cache) {
        var self = this;

        cache = cache !== undefined ? !!cache : true;

        this.$graph.find(this.$state.params).then(function(repository) {
            self.repository = repository;
            return repository.getWorkspaces({ cache: cache });
        }).then(function(workspaces) {
            self.workspaces = {};
            angular.forEach(workspaces, function(workspace) {
                self.workspaces[workspace.name] = workspace;
            });

            self.$$filterWorkspaces();
        });
    };

    RepositoryController.prototype.$$filterWorkspaces = function() {
        var filteredWorkspaceNames = this.$fuzzyFilter(Object.keys(this.workspaces), this.search),
            workspaces = [],
            self = this
        ;

        angular.forEach(filteredWorkspaceNames, function(workspaceName) {
            workspaces.push(self.workspaces[workspaceName]);
        });

        this.$scope.workspaces = workspaces;
    };

    RepositoryController.prototype.openWorkspace = function(workspace) {
        this.$state.go('node', {
            repository: workspace.getRepository().name,
            workspace: workspace.name,
            path: '/' // If not provided, it make the NodeController to be created then destroy then created
        });
    };

    RepositoryController.prototype.showWorkspaceCreationForm = function() {
        this.$scope.isWorkspaceCreationFormDisplayed = true;
    };

    RepositoryController.prototype.hideWorkspaceCreationForm = function() {
        this.$scope.isWorkspaceCreationFormDisplayed = false;
        this.$scope.workspaceCreationForm.name = null;
    };

    RepositoryController.prototype.createWorkspace = function() {
        var self = this;

        if (!this.$scope.workspaceCreationForm.name) {
            return this.$notify()
                    .type('danger')
                    .content('Name is empty')
                    .timeout(3000)
                    .save();
        }

        this.repository.createWorkspace(this.$scope.workspaceCreationForm)
            .then(function() {
                self.$notify()
                    .type('success')
                    .content('Workspace created')
                    .timeout(3000)
                    .save();
            })
            .then(function() {
                self.hideWorkspaceCreationForm();
                self.$$loadWorkspaces(false);
            }, function(err) {
                self.$notify()
                    .type('response')
                    .content(err)
                    .timeout(3000)
                    .save();
            })
        ;
    };

    RepositoryController.prototype.$$removeWorkspace = function(workspace) {
        var self = this;

        workspace
            .remove()
            .then(function() {
                self.$notify()
                    .type('success')
                    .content('Workspace deleted')
                    .timeout(3000)
                    .save();
            })
            .then(function() {
                self.$$loadWorkspaces(false);
            }, function(err) {
                self.$notify()
                    .type('response')
                    .content(err)
                    .timeout(3000)
                    .save();
            })
        ;
    };

    RepositoryController.prototype.$$destroy = function() {
        this.cancelSearchListener();

        this.$scope = undefined;
        this.$state = undefined;
        this.$graph = undefined;
        this.$search = undefined;
        this.$fuzzyFilter = undefined;
        this.$notify = undefined;
        this.search = undefined;
    };

    RepositoryController.$inject = ['$scope', '$state', '$graph', '$search', '$fuzzyFilter', '$notify'];

    return RepositoryController;
});
