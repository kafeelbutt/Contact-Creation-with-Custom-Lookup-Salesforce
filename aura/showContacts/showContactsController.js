({
    doInit: function (component, event, helper){
        var actions = [
            { label: 'Edit', name: 'edit' },
            { label: 'Delete', name: 'delete' } ];
        
        component.set('v.mycolumns', [
            { label: 'First Name', fieldName: 'FirstName', type: 'text' },
            { label: 'Last Name', fieldName: 'LastName', type: 'text' },
            { label: 'Email', fieldName: 'Email', type: 'email' },
            { label: 'Status', fieldName: 'Status__c', type: 'text' },
            { type: 'action', typeAttributes: { rowActions: actions } } ]);
        
        helper.pullData(component);
    },
    
    handleRowAction: function (component, event, helper){
        var action = event.getParam('action');
        switch (action.name){
            case 'edit':
                helper.editRecord(component, event,helper);
                break;
            case 'delete':
                helper.deleteRecord(component, event);
                break;
        }
    },
    getEvents : function(component, event, helper) {
        var evtValue = event.getParam("isInserted");
        if(evtValue===true){
            helper.pullData(component);
        }
    }
});