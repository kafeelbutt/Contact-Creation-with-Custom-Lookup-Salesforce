({
    showToast : function(component, event, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": message
        });
        toastEvent.fire();
    },
    
    saveContactHelper : function(component,event,helper){
        var conObj = component.get("v.objContact");
        if(conObj.Id===undefined){
            conObj.AccountId = null ; 
           // check if selectedLookupRecord is not equal to undefined then set the accountId from 
           // selected Lookup Object to Contact Object before passing this to Server side method
           if(component.get("v.selectedLookUpRecord").Id != undefined){
               conObj.AccountId = component.get("v.selectedLookUpRecord").Id;
           } 
            //call apex class method
            var action = component.get('c.saveContact');
            action.setParams({
                'con': conObj
            })
            action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                
                helper.showToast(component,event,"Records Inserted Successfully");
                var appEvent = $A.get("e.c:InsertorNot");
                appEvent.setParams({"isInserted":true});
                appEvent.fire();
                component.set("v.objContact.Id",undefined);
                component.set("v.objContact.AccountId",'');
                component.set("v.objContact.FirstName",'');
                component.set("v.objContact.LastName",'');
                component.set("v.objContact.Email",'');
                component.set("v.selOption",'');
                var clearValue = component.find("getSelecteValue");
                clearValue.clearLookupValue();
            }
            });
        }
        else{
            if(component.get("v.selectedLookUpRecord").Id != conObj.AccountId){
                conObj.AccountId = component.get("v.selectedLookUpRecord").Id;
            } 
            
            var action = component.get("c.updateRecords");
            action.setParams({
                'con':conObj
            });
            action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                helper.showToast(component,event,"Records Updated Successfully");
                var appEvent = $A.get("e.c:InsertorNot");
                appEvent.setParams({"isInserted":true});
                appEvent.fire();
                component.set("v.objContact.Id",'');
                component.set("v.objContact.FirstName",'');
                component.set("v.objContact.LastName",'');
                component.set("v.objContact.Email",'');
                component.set("v.objContact.AccountId",'');
                component.set("v.selOption",'');
                var clearValue = component.find("getSelecteValue");
                clearValue.clearLookupValue();
            }
            });
        }
        $A.enqueueAction(action);
    }
})