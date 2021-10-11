({
    handleCancel : function(component, event, helper) {
        component.find("modalLib").notifyClose();
    },
    handleOK : function(component, event, helper) {
        var action = component.get("c.delContact");
        action.setParams({
            "contactRec": component.get("v.objContact")
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS" ){
            this.showToast("Success!","success","The record has been delete successfully.");
            }
            else {
                this.showToast("ERROR","error",JSON.stringify(response.getError()));
            }
        });
        $A.enqueueAction(action);
        component.find("modalLib").notifyClose();
    }
})