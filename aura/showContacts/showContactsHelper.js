({  
    pullData:function(component){
        component.set("v.isLoading", true);
        var action=component.get("c.getContactData");       
        action.setCallback(this,function(e){
            component.set("v.isLoading", false);
            if(e.getState()=='SUCCESS'){
                var results=e.getReturnValue();
                if(results.length>0){
                    component.set('v.results', results);
                }
                else{
                    component.set('v.results', []);
                }
            }
            else{
                this.showToast("ERROR","error",JSON.stringify(e.getError()));
            }
        });
        $A.enqueueAction(action);
    },
    editRecord : function(component, event,helper) {
        var row = event.getParam('row');
        var actId = row.AccountId;
        var recordId = row.Id;
        var FirstName = row.FirstName;
        var LastName = row.LastName;
        var Email = row.Email;
        var Status = row.Status__c;
        var appEvent = $A.get("e.c:SendEditRecords");               
        
        appEvent.setParams({"Id":recordId,"FirstName":FirstName,"LastName":LastName,"Email":Email,"Status":Status,"AccountId":actId});                                               
        appEvent.fire();
        //$A.get("e.force:editRecord").setParams({"recordId": recordId}).fire();
    },
    deleteRecord : function(component, event) {
        component.set("v.isLoading", true);
        var action = event.getParam('action');
        var contactRec = event.getParam('row');        
        var action = component.get("c.delContact");
        action.setParams({
            "contactRec": contactRec
        });
        action.setCallback(this, function(response) {
            component.set("v.isLoading", false);
            if (response.getState() === "SUCCESS" ){
            var rows = component.get('v.results');
            var rowIndex = rows.indexOf(contactRec);
            rows.splice(rowIndex, 1);
            component.set('v.results', rows);
            this.showToast("Success!","success","The record has been delete successfully.");
            }
            else {
                this.showToast("ERROR","error",JSON.stringify(response.getError()));
            }
        });
        $A.enqueueAction(action);
    },
    showToast:function(title,type,message){
        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent){
            toastEvent.setParams({"title": title,"type": type,"message": message}).fire();
        }
        else{
            alert(message);
        }
    }
 })