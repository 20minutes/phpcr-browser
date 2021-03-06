/*global describe,it,expect,beforeEach*/
define([
    'app/Graph/component/model/Workspace',
    'app/Graph/component/model/Node',
    'mock/Restangular',
    'mixin'
], function(Workspace, Node, Restangular, mixin) {
    'use strict';

    var restangular,
        repository,
        workspace,
        nodes
    ;

    beforeEach(function() {
        repository = {};

        nodes = [new Restangular()];

        nodes[0].path = '/test';

        restangular = new Restangular(nodes, nodes[0]);

        spyOn(restangular, 'all').andCallThrough();

        workspace = new Workspace(restangular, repository);
    });

    describe('Workspace', function() {
        it('should call Restangular.all to get nodes collection', function() {
            expect(restangular.all).toHaveBeenCalledWith('nodes');
        });

        it('should call get when getNode is called and return a Node', function() {
            spyOn(restangular, 'one').andCallThrough();
            spyOn(restangular, 'get').andReturn(mixin.buildPromise(nodes[0]));

            workspace.getNode('/toto', true).then(function(node) {
                // As we use our mock, the promises are always resolved synchronously
                expect(restangular.one).toHaveBeenCalledWith('toto');
                expect(restangular.get).toHaveBeenCalledWith({ reducedTree: 'true' });
                expect(node instanceof Node).toBe(true);
            });
        });

        it('should return the repository when getRepository is called', function() {
            expect(workspace.getRepository()).toBe(repository);
        });

        it('should call remove on restangularizedElement when remove is called', function() {
            var remove = jasmine.createSpy('remove');
            workspace.name = 'default';

            spyOn(restangular, 'one').andReturn({
                remove: remove
            });

            workspace.remove();

            expect(restangular.one).toHaveBeenCalledWith('default');
            expect(remove).toHaveBeenCalled();
        });
    });
});
