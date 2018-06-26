// Application
var app = angular.module('TechManager', ['ui.bootstrap', 'angularGrid', 'ngAnimate', 'isteven-multi-select']);
// ---


$(document).ready(function () {
    $('#startTime').timeEntry({ show24Hours: true, noSeparatorEntry: true });
    $('#endTime').timeEntry({ show24Hours: true, noSeparatorEntry: true });
});


// Navigation Menu
app.controller('NavMenuAdminController', function ($scope, $http) {
    $scope.init = function () {
        if (location.href.indexOf("Equipments") > -1) {
            $scope.Equipments = 'active';
        }
        if (location.href.indexOf("Actions") > -1) {
            $scope.Actions = 'active';
        }
        //if (location.href.indexOf("Visits") > -1) {
        //    $scope.Visits = 'active';
        //}

        $http.get('/Home/InitPage').then(function (response) {
            $scope.userName = response.data.userName;            
        });        
    }
});


app.controller('NavMenuEngineerController', function ($scope, $http) {
    $scope.init = function () {
        if (location.href.indexOf("Visits") > -1) {
            $scope.Visits = 'active';
        }

        $http.get('/Home/InitPage').then(function (response) {
            $scope.userName = response.data.userName;
        });
    }
});
// ---



// Visits
app.service('pickerService', function () {
    var date_from, date_to;

    var setDates = function (new_date_from, new_date_to) {
        date_from = new_date_from;
        date_to = new_date_to;
    }

    var getDates = function () {
        return { date_from: date_from, date_to: date_to };
    }

    var daysInMonth = function (m, y) {
        return 32 - moment(y, m, 32);
    }

    var getFromDateString = function () {
        return moment(date_from).format('YYYY-MM-DD') + ' 00:00:00';
    }

    var getToDateString = function () {
        return moment(date_to).format('YYYY-MM-DD') + ' 23:59:59';
    }

    return {
        setDates: setDates,
        getDates: getDates,
        daysInMonth: daysInMonth,
        getFromDateString: getFromDateString,
        getToDateString: getToDateString
    };
});


app.controller('VisitsController', function ($scope, $http, pickerService, $modal) {
    var dt = moment();

    $scope.openFromDatepicker = function ($event) {
        $scope.from_opened = true;
    };

    $scope.openToDatepicker = function ($event) {
        $scope.to_opened = true;
    };

    var filterDate = function (dat) {
        return dat.toDate();
    }

    $scope.date_from = filterDate(dt);
    $scope.date_to = filterDate(dt);

    $scope.$watch('date_from', function (newval, oldval) {
        pickerService.setDates($scope.date_from, $scope.date_to);
        if (newval !== oldval) {
        }
    }, true);

    $scope.$watch('date_to', function (newval, oldval) {
        pickerService.setDates($scope.date_from, $scope.date_to);
        if (newval !== oldval) {
        }
    }, true);

    $scope.menuChoiceClick = function (sign) {
        var year = dt.year();
        switch (sign) {
            case "today":
                $scope.date_from = filterDate(moment());
                $scope.date_to = filterDate(moment());
                break;
            case "year":
                $scope.date_from = filterDate(moment([year, 0, 1]));
                $scope.date_to = filterDate(moment([year, 11, 31]));
                break;
            case "kvartali1":
                $scope.date_from = filterDate(moment([year, 0, 1]));
                $scope.date_to = filterDate(moment([year, 2, 31]));
                break;
            case "kvartali2":
                $scope.date_from = filterDate(moment([year, 3, 1]));
                $scope.date_to = filterDate(moment([year, 5, 30]));
                break;
            case "kvartali3":
                $scope.date_from = filterDate(moment([year, 6, 1]));
                $scope.date_to = filterDate(moment([year, 8, 30]));
                break;
            case "kvartali4":
                $scope.date_from = filterDate(moment([year, 9, 1]));
                $scope.date_to = filterDate(moment([year, 11, 31]));
                break;
            case "yan":
                $scope.date_from = filterDate(moment([year, 0, 1]));
                $scope.date_to = filterDate(moment([year, 0, 31]));
                break;
            case "feb":
                $scope.date_from = filterDate(moment([year, 1, 1]));
                $scope.date_to = filterDate(moment([year, 1, moment([year, 1]).daysInMonth()]));
                break;
            case "mar":
                $scope.date_from = filterDate(moment([year, 2, 1]));
                $scope.date_to = filterDate(moment([year, 2, 31]));
                break;
            case "apr":
                $scope.date_from = filterDate(moment([year, 3, 1]));
                $scope.date_to = filterDate(moment([year, 3, 30]));
                break;
            case "may":
                $scope.date_from = filterDate(moment([year, 4, 1]));
                $scope.date_to = filterDate(moment([year, 4, 31]));
                break
            case "jun":
                $scope.date_from = filterDate(moment([year, 5, 1]));
                $scope.date_to = filterDate(moment([year, 5, 30]));
                break;
            case "jul":
                $scope.date_from = filterDate(moment([year, 6, 1]));
                $scope.date_to = filterDate(moment([year, 6, 31]));
                break;
            case "aug":
                $scope.date_from = filterDate(moment([year, 7, 1]));
                $scope.date_to = filterDate(moment([year, 7, 31]));
                break;
            case "sep":
                $scope.date_from = filterDate(moment([year, 8, 1]));
                $scope.date_to = filterDate(moment([year, 8, 30]));
                break;
            case "oct":
                $scope.date_from = filterDate(moment([year, 9, 1]));
                $scope.date_to = filterDate(moment([year, 9, 31]));
                break;
            case "nov":
                $scope.date_from = filterDate(moment([year, 10, 1]));
                $scope.date_to = filterDate(moment([year, 10, 30]));
                break;
            case "dec":
                $scope.date_from = filterDate(moment([year, 11, 1]));
                $scope.date_to = filterDate(moment([year, 11, 31]));
                break;
        }

        pickerService.setDates($scope.date_from, $scope.date_to);
    };

    $scope.dateOptions = {
        startingDay: 1
    };

    $scope.init = function () {
        window.addEventListener('resize', function (event) {
            $('#containerVisits').css("height", $(window).height() - 125);
        });
        $('#containerVisits').css("height", $(window).height() - 125);

        app.GetVisits = function (searchText, signatureOwner, asPerContract, rent, sales, other1, inOffice, onSite, warranty, postWarranty, other2, toAccount, paymentOnDelivery, paid, warrantyPay, rentPay, protocolText, actionCommentText, searchInProductList) {
            $scope.ShowLoader = true;
            $http.get('/Home/InitPage').then(function (response) {
                $scope.userID = response.data.userID;
                $scope.x = response.data.x.x;

                //$scope.gridOptions.api.showLoading(true);
                $http.post('/Home/GetVisits', { userID: $scope.x ? null : $scope.userID, fromDate: moment($scope.date_from).format('YYYY-MM-DD'), toDate: moment($scope.date_to).format('YYYY-MM-DD'), searchText: searchText, signatureOwner: signatureOwner, asPerContract: asPerContract, rent: rent, sales: sales, other1: other1, inOffice: inOffice, onSite: onSite, warranty: warranty, postWarranty: postWarranty, other2: other2, toAccount: toAccount, paymentOnDelivery: paymentOnDelivery, paid: paid, warrantyPay: warrantyPay, rentPay: rentPay, protocolText: protocolText, actionCommentText: actionCommentText, searchInProductList: searchInProductList }).then(function (response) {
                    angular.forEach(response.data.visits, function (visit) {
                        visit.ID = 'ID' + visit.ID;

                        visit.VisitDate = moment(visit.VisitDate).format('YYYY-MM-DD HH:mm');
                        visit.VisitDate2 = moment(visit.VisitDate2).format('YYYY-MM-DD HH:mm');

                        switch (visit.StatusID) {
                            case EnumVisitStatuses.Unsigned:
                                visit.StatusName = 'ხელმოწერის გარეშე';
                                break;
                            case EnumVisitStatuses.Signed:
                                visit.StatusName = 'ხელმოწერილი';
                                break;
                        }
                    });

                    $scope.visits = response.data.visits;
                    $scope.ShowLoader = false;

                    $scope.gridOptions.rowData = response.data.visits;
                    $scope.gridOptions.api.onNewRows();
                    $scope.gridOptions.api.sizeColumnsToFit();
                });
            });
        }

        app.GetVisits();

        $scope.GetVisits = app.GetVisits;
    }

    $scope.GetVisit = function (visit) {
        location.href = '/Home/VisitRegistration/' + visit.ID.replace(/[^0-9]/g, '');
    }

    $scope.OpenAdvancedSearch = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'SearchInVisitModal.html',
            controller: 'SearchInVisitModalController',
            size: 'md',
            backdrop: 'static'
        });
    }

    var columnDefs = [
        { headerName: 'გაფორმების თარიღი', field: 'VisitDate', width: 130, suppressSizeToFit: true },
        { headerName: 'ID', field: 'ID', width: 100, suppressSizeToFit: true },
        { headerName: 'კომპანია', field: 'ContragentName' },
        { headerName: 'კაზინო', field: 'SubContragentName' },
        { headerName: 'დასრულების თარიღი', field: 'VisitDate2', width: 130, suppressSizeToFit: true },
        { headerName: 'სტატუსი', field: 'StatusName', width: 150, suppressSizeToFit: true },
        { headerName: 'საქონელი', field: 'hasProductList', width: 90, suppressSizeToFit: true },
        { headerName: 'მრიცხველი', field: 'hasProtocol', width: 90, suppressSizeToFit: true },
        { headerName: 'ტექნიკოსი', field: 'CreatorUserFullName' },
        { headerName: 'კომენტარი', field: 'Comment' }
        //{
        //    headerName: '',
        //    field: '',
        //    width: 80,
        //    suppressSizeToFit: true,
        //    cellRenderer: function (params) {
        //        return "<img src='../../Content/Resources/edit18.png' style='cursor: pointer; display: block; margin-left: auto; margin-right: auto; margin-top: 3px;' title='რედაქტირება' />";
        //    },
        //}
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        enableColResize: true,
        rowSelection: 'single',
        enableFilter: true,
        rowClicked: function (obj) {
            $scope.GetVisit(obj.data);
        }
    }    
});


app.controller('SearchInVisitModalController', function ($scope, $modalInstance) {
    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.Search = function () {
        app.GetVisits($scope.searchText, $scope.signatureOwner, $scope.asPerContract, $scope.rent, $scope.sales, $scope.other1, $scope.inOffice, $scope.onSite, $scope.warranty, $scope.postWarranty, $scope.other2, $scope.toAccount, $scope.paymentOnDelivery, $scope.paid, $scope.warrantyPay, $scope.rentPay, $scope.protocolText, $scope.actionCommentText, $scope.searchInProductList);
        $scope.Cancel();
    }
});
// ---



// VisitRegistration
app.controller('VisitRegistrationController', function ($scope, $http, $modal, $window) {
    $scope.ShowLoader = true;
    var actions = [];
    $scope.generatedResults = [];
    $scope.visitProcessProducts = [];
    var signaturePadContragent, signaturePadUser,
        contragentSignature, userSignature,
        contragentProtocolSignature, userProtocolSignature;    

    $scope.init = function () {       
        $scope.visitDate = moment().format('YYYY-MM-DD');
        $scope.visitDate2 = moment().format('YYYY-MM-DD');

        $scope.protocol = {
            id: 0,
            date: moment().format('YYYY-MM-DD'),
            subProtocols: []
        }

        $http.get('/Home/InitPage').then(function (response) {
            $scope.x = response.data.x.x;
            $scope.userName = response.data.userName;

            if (!IsNullOrEmpty(visitID)) {
                $http.post('/Home/GetVisitStatus', { visitId: visitID }).then(function (response) {
                    $scope.blockControl = $scope.x ? false : response.data.visitStatus === EnumVisitStatuses.Signed;
                });
            } else {
                $scope.blockControl = false;
            }
        });

        $http.get('/Home/GetSubContragents').then(function (response) {
            $scope.subContragents = response.data.subContragents;
        });        

        $http.get('/Home/GetEquipmentGroupsWithEquipments').then(function (response) {
            $scope.equipmentGroups = response.data.equipmentGroups;
        });

        $scope.chosenEquipments = [];

        $http.get('/Home/GetActionsWithActionItems').then(function (response) {
            actions = response.data.actions;
        });

        $http.post('/Home/GetCurrencyRateById', { id: EnumCurrencies.EUR }).then(function (response) {
            $scope.rate = response.data;
        });

        $http.post('/Home/GetCurrencyRateById', { id: EnumCurrencies.USD }).then(function (response) {
            $scope.rateUSD = response.data;
        });

        $http.get('/Home/GetStores').then(function (response) {
            $scope.stores = response.data;
        });        

        $scope.visitProcesses = [];
        $scope.saleTypes = SaleTypes;

        $scope.blockBtnProtocol = IsNullOrEmpty(visitID);

        $scope.GetVisit = function () {
            if (!IsNullOrEmpty(visitID)) {
                //$scope.ShowLoader = true;
                $http.post('/Home/GetVisit', { visitID: visitID }).then(function (response) {
                    //TODO change
                    $scope.id = response.data.id;
                    if ($scope.id !== undefined) {
                        $scope.Comment = response.data.Comment;
                        $scope.createDate = response.data.createDate;
                        $scope.endDate = response.data.endDate;
                        $scope.SubContragentId = response.data.SubContragentId;


                        $scope.protocolId = response.data.protocolId;
                        // bool start
                        $scope.warranty = response.data.warranty;
                        $scope.postWarranty = response.data.postWarranty;
                        $scope.inOffice = response.data.inOffice;
                        $scope.onSite = response.data.onSite;
                        $scope.asPerContract = response.data.asPerContract;
                        $scope.rent = response.data.rent;
                        $scope.sales = response.data.sales;
                        $scope.paid = response.data.paid;
                        $scope.toAccount = response.data.toAccount;
                        $scope.paymentOnDelivery = response.data.paymentOnDelivery;
                        $scope.other1 = response.data.other1;
                        $scope.other2 = response.data.other2;
                        $scope.warrantyPay = response.data.warrantyPay;
                        $scope.rentPay = response.data.rentPay;
                        $scope.clientFullName = response.data.clientFullName;
                        // ---


                        $scope.selectedSubContragent = {
                            id: response.data.subContragent.id,
                            name: response.data.subContragent.name,
                            contragent: {
                                id: response.data.subContragent.contragent.id,
                                name: response.data.subContragent.contragent.name
                            }
                        }


                        $scope.protocol = response.data.protocol === null ? $scope.protocol = {
                            id: 0,
                            date: moment().format('YYYY-MM-DD'),
                            subProtocols: [],
                        } : response.data.protocol;

                        $scope.visitDate = response.data.visitDate;
                        $scope.visitDate2 = response.data.visitDate2;
                        $scope.startTime = response.data.startTime;
                        $scope.endTime = response.data.endTime;


                        $http.get('/Home/GetEquipmentTypes').then(function (response) {
                            $scope.equipmentTypes = response.data.equipmentTypes;

                            $http.post('/Home/GetEquipmentTypesByIds', { ids: $scope.protocol.equipmentTypeIds }).then(function (response) {                                                                
                                angular.forEach(response.data, function (x) {
                                    var model = GetModelByID($scope.equipmentTypes, x.id);
                                    if (!IsNullOrEmpty(model)) model.ticked = true;
                                })
                                $scope.selectedEquipmentTypes = response.data;
                                $scope.ManageSelectedEquipmentTypes();
                            });
                        });


                        $http.get('/Home/GetProgramVersions').then(function (response) {
                            $scope.programVersions = response.data.programVersions;

                            $http.post('/Home/GetProgramVersionsByIds', { ids: $scope.protocol.programVersionIds }).then(function (response) {                                
                                angular.forEach(response.data, function (x) {
                                    var model = GetModelByID($scope.programVersions, x.id);
                                    if (!IsNullOrEmpty(model)) model.ticked = true;
                                })
                                $scope.selectedProgramVersions = response.data;
                                $scope.ManageSelectedProgramVersions();
                            });
                        });                       

                        


                        //Signatures 
                        contragentProtocolSignature = response.data.protocol === null ? '' : response.data.protocol.contragentSignature;
                        $scope.contragentProtocolSignature = response.data.protocol === null ? '' : response.data.protocol.contragentSignature;
                        userProtocolSignature = response.data.protocol === null ? '' : response.data.protocol.technicalSignature;
                        $scope.userProtocolSignature = response.data.protocol === null ? '' : response.data.protocol.technicalSignature;

                        $scope.ValidateSelectedSubContragent();

                        contragentSignature = response.data.contragentSignature;
                        $scope.contragentSignature = response.data.contragentSignature;
                        userSignature = response.data.creatorUserSignature;
                        $scope.userSignature = response.data.creatorUserSignature;
                        //---

                        angular.forEach(response.data.visitProcesses, function (visitProcess) {
                            angular.forEach(visitProcess.chosenEquipments, function (visitProcessChosenEquipment) {
                                visitProcessChosenEquipment.DoorOpenDate = visitProcessChosenEquipment.DoorOpenDate === null || visitProcessChosenEquipment.DoorOpenDate === '' ? '' : moment(visitProcessChosenEquipment.DoorOpenDate).format('YYYY-MM-DD');
                                visitProcessChosenEquipment.DoorOpenTime = visitProcessChosenEquipment.DoorOpenTime === null || visitProcessChosenEquipment.DoorOpenTime === '' ? '' : moment(visitProcessChosenEquipment.DoorOpenTime).format('HH:mm');
                            });
                        });

                        $scope.visitProcesses = response.data.visitProcesses;
                        $scope.showGeneratedTable = true;
                    }

                    $scope.ShowLoader = false;
                    //---
                });
            } else {
                $scope.selectedEquipmentType = null;
                $scope.selectedProgramVersion = null;

                $http.get('/Home/GetEquipmentTypes').then(function (response) {
                    $scope.equipmentTypes = response.data.equipmentTypes;
                });

                $http.get('/Home/GetProgramVersions').then(function (response) {
                    $scope.programVersions = response.data.programVersions;
                });

                $scope.ShowLoader = false;
            }
        }

        $scope.GetVisit(); // Invoking this method for page initialization
    }

    $scope.openDatepickerVisit = function ($event) {
        $scope.date_opened_visit = true;
    };

    $scope.openDatepickerVisit2 = function ($event) {
        $scope.date_opened_visit2 = true;
    };

    $scope.dateOptionsVisit = {
        startingDay: 1
    };

    $scope.ValidateSelectedSubContragent = function() {
        if ($scope.selectedSubContragent !== undefined) {
            $scope.selectedContragent = $scope.selectedSubContragent.contragent;

            app.selectedContragentCode = $scope.selectedContragent.code;

            return $scope.selectedSubContragent.id !== undefined;
        } else {
            $scope.selectedContragent = null;
            return false;
        }
    }

    $scope.GetEquipmentsByGroup = function (equipmentGroup) {
        angular.forEach($scope.equipmentGroups, function (eg) {
            eg.checked = false;
        });
        angular.forEach($scope.equipments, function (eq) {
            eq.checked = false;
        });
        equipmentGroup.checked = true;

        $scope.equipments = equipmentGroup.Equipments;
    }

    $scope.OpenEquipmentsLayout = function () {
        $http.get('/Home/GetServerDateTime').then(function (response) {
            if (response.data != null) {
                $scope.firstCreateDate = response.data;

                $scope.visitProcessID = 0;

                $scope.chosenEquipments = [];
                $scope.generatedResults = [];
                $scope.visitProcessProducts = [];
                $scope.equipments = [];
                $scope.actions = [];
                $scope.actionItems = [];

                $scope.ShowEquipmentsLayout = false;
                $scope.showChosenEquipmentsTable = false;
                $scope.showFinalResultsTable = false;

                $scope.ShowEquipmentsLayout = true;
            } else {
                alert('სერვერთან კავშირი ვერ ხერხდება!');
            }
        });
    }

    $scope.CloseEquipmentsLayout = function () {
        $scope.ShowEquipmentsLayout = false;
    }

    $scope.ChooseEquipment = function (equipment, equipmentIndex, $event) {       
        if (equipment !== undefined) {
            angular.forEach($scope.equipments, function (eq) {
                eq.checked = false;
            });
            equipment.checked = true;

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'ChosenEquipmentModal.html',
                controller: 'ChosenEquipmentModalController',
                size: 'md',
                backdrop: 'static'
            });
            modalInstance.EquipmentID = equipment.ID;
            modalInstance.equipmentName = equipment.Name;
            modalInstance.equipmentSeries = equipment.EquipmentSeries === undefined ? '' : equipment.EquipmentSeries;
            modalInstance.doorOpenDate = equipment.DoorOpenDate === undefined ? '' : equipment.DoorOpenDate;
            modalInstance.doorOpenTime = equipment.DoorOpenTime === undefined ? '' : equipment.DoorOpenTime;
            modalInstance.equipmentGroupID = equipment.EquipmentGroupID === undefined ? 0 : equipment.EquipmentGroupID;
            modalInstance.equipmentIndex = equipmentIndex;            
        } else {
            var accepted = confirm('გინდათ წაშლა?');
            if (accepted) {
                var toDel = $scope.chosenEquipments[equipmentIndex];

                if (toDel.ID > 0) {
                    toDel.Deleted = true;
                } else {
                    $scope.chosenEquipments.splice(equipmentIndex, 1);
                }
                
                //$scope.chosenEquipments = GetNotDeletedObjects($scope.chosenEquipments);
                $event.stopPropagation();
            }            
        }
    }

    app.PushChosenEquipments = function (chosenEquipment, equipmentIndex) {
        $scope.showChosenEquipmentsTable = true;

        if (equipmentIndex !== undefined) {
            var equipment = $scope.chosenEquipments[equipmentIndex];
            equipment.EquipmentSeries = chosenEquipment.EquipmentSeries;
            equipment.DoorOpenDate = chosenEquipment.DoorOpenDate;
            equipment.DoorOpenTime = chosenEquipment.DoorOpenTime;
            equipment.EquipmentGroupID = chosenEquipment.EquipmentGroupID;
        } else {
            $scope.chosenEquipments.push(chosenEquipment);
        }
    }

    $scope.OpenActionsLayout = function () {
        if ($scope.generatedResults.length === 0) {
            app.fakeId = 1;
        } else {
            app.fakeId = $scope.generatedResults.Max('fakeId') + 1;
        }

        $scope.ShowActionsLayout = true;
    }

    $scope.CloseActionsLayout = function () {
        $scope.ShowActionsLayout = false;
    }

    $scope.CheckChosenEquipment = function (chosenEquipment) {
        chosenEquipment.checked = chosenEquipment.checked;

        if (chosenEquipment.checked) {
            $scope.actions = actions;

            if (GetCheckedItemsCount($scope.chosenEquipments) === $scope.chosenEquipments.length) {
                $scope.allChosenEquipmentsChecked = true;
            }
        } else {
            $scope.allChosenEquipmentsChecked = false;

            if (GetCheckedItemsCount($scope.chosenEquipments) === 0) {
                $scope.actions = [];
                $scope.actionItems = [];
                $scope.subActionItems = [];
            }
        }
    }

    $scope.CheckAllChosenEquipments = function (chosenEquipments) {
        if (chosenEquipments !== undefined) {
            angular.forEach(chosenEquipments, function (chosenEquipment) {
                chosenEquipment.checked = $scope.allChosenEquipmentsChecked;
            });

            $scope.actions = $scope.allChosenEquipmentsChecked ? actions : [];
            if (!$scope.allChosenEquipmentsChecked) {
                $scope.actionItems = [];
            }
        }
    }

    $scope.GetActionItemsByAction = function (action) {
        angular.forEach($scope.actions, function (a) {
            a.checked = false;
        });
        angular.forEach($scope.actionItems, function (ai) {
            ai.checked = false;
        });
        angular.forEach($scope.subActionItems, function (sai) {
            sai.checked = false;
        });
        action.checked = true;

        $scope.showSubActionItems = false;

        $scope.action = action;
        $scope.actionItems = action.ActionItems;
        $scope.subActionItems = [];
    }

    $scope.SelectSaleType = function (saleTypeIndex, visitProcessProduct) {
        visitProcessProduct.SaleTypeID = saleTypeIndex;
    }

    $scope.SelectStore = function (storeId, visitProcessProduct) {
        visitProcessProduct.StoreId = storeId;
    }

    $scope.ChooseActionItem = function (chosenActionItem) {
        angular.forEach($scope.actionItems, function (ai) {
            ai.checked = false;
        });
        angular.forEach($scope.subActionItems, function (sai) {
            sai.checked = false;
        });
        chosenActionItem.checked = true;

        //$scope.selectedEquipments = GetCheckedItems($scope.chosenEquipments);
        $scope.chosenActionItem = chosenActionItem;
        $scope.subActionItems = chosenActionItem.subActionItems;

        if ($scope.chosenActionItem.hasSerial) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'SerialModal.html',
                controller: 'SerialModalController',
                size: 'md',
                backdrop: 'static'
            });

            modalInstance.actionItemName = $scope.chosenActionItem.Name;
        }
    }

    $scope.FilterGeneratedResult = function (gr) {
        return gr.Text !== null;
    }

    $scope.GetFilteredGeneratedResults = function (gres) {
        var res = [];
        angular.forEach(gres, function (gr) {
            if (gr.Text !== null && !gr.Deleted) {
                res.push(gr);
            }
        });
        return res;
    }

    $scope.DetectDublicatedGeneratedResultText = function (serialNumber) {
        var result = false;

        angular.forEach(GetNotDeletedObjects($scope.generatedResults), function (gr) {
            if (gr.Text !== null) {
                if (gr.Text.indexOf(serialNumber) > -1) {
                    result = true;
                }
            }
        });

        return result;
    }

    $scope.GetDublicatedGeneratedResult = function (serialNumber) {
        var result;

        angular.forEach(GetNotDeletedObjects($scope.generatedResults), function (gr) {
            if (gr.Text !== null) {
                if (gr.Text.indexOf(serialNumber) > -1) {
                    result = gr;
                }
            }
        });

        return result;
    }

    app.pushToVisitProcessProducts = function (product, saleTypeID, amount, newSeries, storeId, discount) {
        var chosenProduct = {
            VisitProcessID: $scope.visitProcessID,
            ProductID: product.ID,
            ProductName: product.groupName,
            subActionItemName: product.Name,
            SaleTypeID: saleTypeID,
            Amount: amount,
            PriceEUR: product.currencyType === EnumCurrencies.EUR ? product.Price : 0,
            PriceUSD: product.currencyType === EnumCurrencies.USD ? product.Price : 0,
            PriceGEL: Math.round((product.currencyType === EnumCurrencies.EUR ? product.Price * $scope.rate : product.currencyType === EnumCurrencies.USD ? product.Price * $scope.rateUSD : product.Price) * 100) / 100,
            Price: product.Price == null ? 0 : product.Price,
            Rate: $scope.rate,
            RateUSD: $scope.rateUSD,
            StoreId: storeId,
            discount: discount,
            total: Math.round(((product.currencyType === EnumCurrencies.EUR ? product.Price * $scope.rate : product.currencyType === EnumCurrencies.USD ? product.Price * $scope.rateUSD : product.Price) * parseInt(amount)) * 100) / 100,
            currencyType: product.currencyType,
            unitName: product.unitName,
            generalId: $scope.visitProcessProducts.generalId,
            productCode: product.Code,
            NewSeries: newSeries
        };

        if (discount > 0) {
            //chosenProduct.PriceEUR = Math.round((chosenProduct.PriceEUR === 0 ? 0 : chosenProduct.PriceEUR - (chosenProduct.PriceEUR * (discount / 100))) * 100) / 100;
            //chosenProduct.PriceUSD = Math.round((chosenProduct.PriceUSD === 0 ? 0 : chosenProduct.PriceUSD - (chosenProduct.PriceUSD * (discount / 100))) * 100) / 100;
            chosenProduct.total = Math.round(((chosenProduct.PriceGEL - (chosenProduct.PriceGEL * (discount / 100))) * chosenProduct.Amount) * 100) / 100;
            //chosenProduct.PriceGEL = Math.round((chosenProduct.PriceGEL - (chosenProduct.PriceGEL * (discount / 100))) * 100) / 100;
        }

        if (saleTypeID === 1 || saleTypeID === 4) { //შეცვლა ან გახარჯვა
            chosenProduct.PriceEUR = 0;
            chosenProduct.PriceUSD = 0;
            chosenProduct.PriceGEL = 0;
            chosenProduct.total = 0;
        }

        $scope.showFinalResultsTable = true;
        $scope.visitProcessProducts.push(chosenProduct);
    }

    $scope.ChooseSubActionItem = function (chosenSubActionItem) {
        angular.forEach($scope.subActionItems, function (sai) {
            sai.checked = false;
        });
        chosenSubActionItem.checked = true;

        var action = GetModelByID($scope.actions, $scope.chosenActionItem.ActionID);
        $scope.selectedEquipments = GetCheckedItems($scope.chosenEquipments);
        $scope.showFinalResultsTable = true;        

        angular.forEach($scope.selectedEquipments, function (selectedEquipment) {
            var generatedText = '';

            $scope.GeneratedResultPushItem = function (fakeId) {
                $scope.generatedResults.push({
                    Text: generatedText,
                    EquipmentID: selectedEquipment.EquipmentID,
                    ActionItemID: $scope.chosenActionItem.ID,
                    VisitProcessID: $scope.visitProcessID,
                    fakeId: fakeId
                });
            }            

            if (action.ActionTypeID == EnumActionTypes.Other) { //sxva
                if ($scope.generatedResults.length === 0) { //generate new text
                    generatedText = IsUndefinedNullOrEmpty(selectedEquipment.DoorOpenDate) ? ($scope.equipmentGroups.First('ID == ' + selectedEquipment.EquipmentGroupID).Name + ' ' + selectedEquipment.Name + ' SN(' + selectedEquipment.EquipmentSeries + ') ' + ($scope.action.isHidden ? '' : $scope.action.Name) + ' ' + ($scope.chosenActionItem.isHidden ? '' : $scope.chosenActionItem.Name) + ' ' + ($scope.chosenActionItem.hasSerial ? (app.singleSerial === undefined ? '' : 'SN(' + app.singleSerial + ') ') : '') + (chosenSubActionItem.isHidden ? '' : chosenSubActionItem.name))
                        : ($scope.equipmentGroups.First('ID == ' + selectedEquipment.EquipmentGroupID).Name + ' ' + selectedEquipment.Name + ' SN(' + selectedEquipment.EquipmentSeries + ') მთავარი კარის ბოლო გაღების თარიღი და დრო(' + selectedEquipment.DoorOpenDate + ' ' + selectedEquipment.DoorOpenTime + ') ' + ($scope.action.isHidden ? '' : $scope.action.Name) + ' ' + ($scope.chosenActionItem.isHidden ? '' : $scope.chosenActionItem.Name) + ' ' + ($scope.chosenActionItem.hasSerial ? (app.singleSerial === undefined ? '' : 'SN(' + app.singleSerial + ') ') : '') + (chosenSubActionItem.isHidden ? '' : chosenSubActionItem.name));

                    $scope.chosenActionItem = $scope.chosenActionItem;
                    $scope.subActionItems = $scope.chosenActionItem.subActionItems;

                    $scope.GeneratedResultPushItem(app.fakeId);
                } else { //concate to old text or generate new
                    if ($scope.DetectDublicatedGeneratedResultText(selectedEquipment.EquipmentSeries)) { //concate to old text
                        $scope.GetDublicatedGeneratedResult(selectedEquipment.EquipmentSeries).Text += ', ' + ($scope.action.isHidden ? '' : $scope.action.Name) + ' ' + ($scope.chosenActionItem.isHidden ? '' : $scope.chosenActionItem.Name) + ' ' + ($scope.chosenActionItem.hasSerial ? (app.singleSerial === undefined ? '' : 'SN(' + app.singleSerial + ') ') : '') + (chosenSubActionItem.isHidden ? '' : chosenSubActionItem.name);

                        generatedText = null;

                        $scope.chosenActionItem = $scope.chosenActionItem;
                        $scope.subActionItems = $scope.chosenActionItem.subActionItems;

                        $scope.GeneratedResultPushItem($scope.GetDublicatedGeneratedResult(selectedEquipment.EquipmentSeries).fakeId);
                    } else { //generate new text
                        generatedText = IsUndefinedNullOrEmpty(selectedEquipment.DoorOpenDate) ? ($scope.equipmentGroups.First('ID == ' + selectedEquipment.EquipmentGroupID).Name + ' ' + selectedEquipment.Name + ' SN(' + selectedEquipment.EquipmentSeries + ') ' + ($scope.action.isHidden ? '' : $scope.action.Name) + ' ' + ($scope.chosenActionItem.isHidden ? '' : $scope.chosenActionItem.Name) + ' ' + ($scope.chosenActionItem.hasSerial ? (app.singleSerial === undefined ? '' : 'SN(' + app.singleSerial + ') ') : '') + (chosenSubActionItem.isHidden ? '' : chosenSubActionItem.name))
                            : ($scope.equipmentGroups.First('ID == ' + selectedEquipment.EquipmentGroupID).Name + ' ' + selectedEquipment.Name + ' SN(' + selectedEquipment.EquipmentSeries + ') მთავარი კარის ბოლო გაღების თარიღი და დრო(' + selectedEquipment.DoorOpenDate + ' ' + selectedEquipment.DoorOpenTime + ') ' + ($scope.action.isHidden ? '' : $scope.action.Name) + ' ' + ($scope.chosenActionItem.isHidden ? '' : $scope.chosenActionItem.Name) + ' ' + ($scope.chosenActionItem.hasSerial ? (app.singleSerial === undefined ? '' : 'SN(' + app.singleSerial + ') ') : '') + (chosenSubActionItem.isHidden ? '' : chosenSubActionItem.name));

                        $scope.chosenActionItem = $scope.chosenActionItem;
                        $scope.subActionItems = $scope.chosenActionItem.subActionItems;

                        app.fakeId++;
                        $scope.GeneratedResultPushItem(app.fakeId);
                    }
                }
            } else if (action.ActionTypeID == EnumActionTypes.Products) { //masalebi               
                if ($scope.selectedEquipments.length === 1) {
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'ChosenProductModal.html',
                        controller: 'ChosenProductModalController',
                        size: 'md',
                        backdrop: 'static'
                    });

                    modalInstance.productId = chosenSubActionItem.productId;
                    modalInstance.productName = $scope.chosenActionItem.Name + ' ' + chosenSubActionItem.name;
                    modalInstance.saleTypes = $scope.saleTypes;
                    modalInstance.selectedSaleTypeIndex = 0;
                    modalInstance.amount = 1;
                    modalInstance.stores = $scope.stores;
                    modalInstance.discount = 0;
                    modalInstance.currencyType = chosenSubActionItem.currencyType;
                    modalInstance.unitName = chosenSubActionItem.unitName;
                    modalInstance.productCode = chosenSubActionItem.code;
                    modalInstance.calledFromGR = true;

                    app.PushChosenProduct = function (saleTypeID, amount, oldSeries, newSeries, storeId, discount, currencyType, unitName, productCode) {                       
                        var chosenProduct = {
                            VisitProcessID: $scope.visitProcessID,
                            ProductID: chosenSubActionItem.productId,
                            ProductName: chosenSubActionItem.groupName,
                            SaleTypeID: saleTypeID,
                            EquipmentID: selectedEquipment.EquipmentID,
                            ActionItemID: $scope.chosenActionItem.ID,
                            Amount: amount,
                            PriceEUR: chosenSubActionItem.currencyType === EnumCurrencies.EUR ? chosenSubActionItem.price : 0,
                            PriceUSD: chosenSubActionItem.currencyType === EnumCurrencies.USD ? chosenSubActionItem.price : 0,
                            PriceGEL: Math.round((chosenSubActionItem.currencyType === EnumCurrencies.EUR ? chosenSubActionItem.price * $scope.rate : chosenSubActionItem.currencyType === EnumCurrencies.USD ? chosenSubActionItem.price * $scope.rateUSD : chosenSubActionItem.price) * 100) / 100,
                            Price: chosenSubActionItem.price == null ? 0 : chosenSubActionItem.price,
                            Rate: $scope.rate,
                            RateUSD: $scope.rateUSD,
                            OldSeries: oldSeries,
                            NewSeries: newSeries,
                            StoreId: storeId,
                            subActionItemName: chosenSubActionItem.name,
                            discount: discount,
                            total: Math.round(((chosenSubActionItem.currencyType === EnumCurrencies.EUR ? chosenSubActionItem.price * $scope.rate : chosenSubActionItem.currencyType === EnumCurrencies.USD ? chosenSubActionItem.price * $scope.rateUSD : chosenSubActionItem.price) * parseInt(amount)) * 100) / 100,
                            currencyType: currencyType,
                            unitName: unitName,
                            generalId: $scope.visitProcessProducts.generalId,
                            productCode: productCode,
                            fakeId: app.fakeId
                        };

                        if (discount > 0) {
                            //chosenProduct.PriceEUR = Math.round((chosenProduct.PriceEUR === 0 ? 0 : chosenProduct.PriceEUR - (chosenProduct.PriceEUR * (discount / 100))) * 100) / 100;
                            //chosenProduct.PriceUSD = Math.round((chosenProduct.PriceUSD === 0 ? 0 : chosenProduct.PriceUSD - (chosenProduct.PriceUSD * (discount / 100))) * 100) / 100;
                            chosenProduct.total = Math.round(((chosenProduct.PriceGEL - (chosenProduct.PriceGEL * (discount / 100))) * chosenProduct.Amount) * 100) / 100;
                            //chosenProduct.PriceGEL = Math.round((chosenProduct.PriceGEL - (chosenProduct.PriceGEL * (discount / 100))) * 100) / 100;
                        }

                        if (saleTypeID === 1 || saleTypeID === 4) { //შეცვლა ან გახარჯვა
                            chosenProduct.PriceEUR = 0;
                            chosenProduct.PriceUSD = 0;
                            chosenProduct.PriceGEL = 0;
                            chosenProduct.total = 0;
                        }                        

                        if ($scope.generatedResults.length === 0) { //generate new text
                            generatedText = IsUndefinedNullOrEmpty(selectedEquipment.DoorOpenDate) ? $scope.equipmentGroups.First('ID == ' + selectedEquipment.EquipmentGroupID).Name + ' ' + selectedEquipment.Name + ' SN(' + selectedEquipment.EquipmentSeries + ') ' + ($scope.action.isHidden ? '' : $scope.action.Name) + ' ' + ($scope.chosenActionItem.isHidden ? '' : $scope.chosenActionItem.Name) + ' ' + (chosenSubActionItem.isHidden ? '' : chosenSubActionItem.name) + (oldSeries === undefined ? '' : ', ძველის SN(' + oldSeries + ')') + (newSeries === undefined ? '' : ', ახლის SN(' + newSeries + ')')
                                : $scope.equipmentGroups.First('ID == ' + selectedEquipment.EquipmentGroupID).Name + ' ' + selectedEquipment.Name + ' SN(' + selectedEquipment.EquipmentSeries + ') მთავარი კარის ბოლო გაღების თარიღი და დრო(' + selectedEquipment.DoorOpenDate + ' ' + selectedEquipment.DoorOpenTime + ') ' + ($scope.action.isHidden ? '' : $scope.action.Name) + ' ' + ($scope.chosenActionItem.isHidden ? '' : $scope.chosenActionItem.Name) + ' ' + (chosenSubActionItem.isHidden ? '' : chosenSubActionItem.name) + (oldSeries === undefined ? '' : ', ძველის SN(' + oldSeries + ')') + (newSeries === undefined ? '' : ', ახლის SN(' + newSeries + ')');

                            chosenProduct.fakeId = app.fakeId;
                            $scope.GeneratedResultPushItem(app.fakeId);
                        } else { //concate to old text or generate new
                            if ($scope.DetectDublicatedGeneratedResultText(selectedEquipment.EquipmentSeries)) { //concate to old text
                                $scope.GetDublicatedGeneratedResult(selectedEquipment.EquipmentSeries).Text += ', ' + ($scope.action.isHidden ? '' : $scope.action.Name) + ' ' + ($scope.chosenActionItem.isHidden ? '' : $scope.chosenActionItem.Name) + ' ' + (chosenSubActionItem.isHidden ? '' : chosenSubActionItem.name) + (oldSeries === undefined ? '' : ', ძველის SN(' + oldSeries + ')') + (newSeries === undefined ? '' : ', ახლის SN(' + newSeries + ')');

                                generatedText = null;
                                var fki = $scope.GetDublicatedGeneratedResult(selectedEquipment.EquipmentSeries).fakeId;

                                chosenProduct.fakeId = fki;
                                $scope.GeneratedResultPushItem(fki);
                            } else { //generate new text
                                generatedText = IsUndefinedNullOrEmpty(selectedEquipment.DoorOpenDate) ? $scope.equipmentGroups.First('ID == ' + selectedEquipment.EquipmentGroupID).Name + ' ' + selectedEquipment.Name + ' SN(' + selectedEquipment.EquipmentSeries + ') ' + ($scope.action.isHidden ? '' : $scope.action.Name) + ' ' + ($scope.chosenActionItem.isHidden ? '' : $scope.chosenActionItem.Name) + ' ' + (chosenSubActionItem.isHidden ? '' : chosenSubActionItem.name) + (oldSeries === undefined ? '' : ', ძველის SN(' + oldSeries + ')') + (newSeries === undefined ? '' : ', ახლის SN(' + newSeries + ')')
                                    : $scope.equipmentGroups.First('ID == ' + selectedEquipment.EquipmentGroupID).Name + ' ' + selectedEquipment.Name + ' SN(' + selectedEquipment.EquipmentSeries + ') მთავარი კარის ბოლო გაღების თარიღი და დრო(' + selectedEquipment.DoorOpenDate + ' ' + selectedEquipment.DoorOpenTime + ') ' + ($scope.action.isHidden ? '' : $scope.action.Name) + ' ' + ($scope.chosenActionItem.isHidden ? '' : $scope.chosenActionItem.Name) + ' ' + (chosenSubActionItem.isHidden ? '' : chosenSubActionItem.name) + (oldSeries === undefined ? '' : ', ძველის SN(' + oldSeries + ')') + (newSeries === undefined ? '' : ', ახლის SN(' + newSeries + ')');

                                app.fakeId++;
                                chosenProduct.fakeId = app.fakeId;
                                $scope.GeneratedResultPushItem(app.fakeId);
                            }
                        }
                                                
                        $scope.visitProcessProducts.push(chosenProduct);
                    }
                }
            }
        });

        console.log($scope.GetFilteredGeneratedResults($scope.generatedResults));//TODO remove
        console.log('separator');//TODO remove
        console.log($scope.visitProcessProducts);//TODO remove
    }

    $scope.ChangeProductPrice = function (productIndex) {
        if ($scope.visitProcessProducts[productIndex].Amount !== '') {
            $scope.visitProcessProducts[productIndex].PriceEUR = $scope.visitProcessProducts[productIndex].currencyType === EnumCurrencies.EUR ? $scope.visitProcessProducts[productIndex].Price : 0;
            $scope.visitProcessProducts[productIndex].PriceUSD = $scope.visitProcessProducts[productIndex].currencyType === EnumCurrencies.USD ? $scope.visitProcessProducts[productIndex].Price : 0;
            $scope.visitProcessProducts[productIndex].PriceGEL = Math.round(($scope.visitProcessProducts[productIndex].currencyType === EnumCurrencies.EUR ? $scope.visitProcessProducts[productIndex].Price * $scope.visitProcessProducts[productIndex].Rate : $scope.visitProcessProducts[productIndex].currencyType === EnumCurrencies.USD ? $scope.visitProcessProducts[productIndex].Price * $scope.visitProcessProducts[productIndex].RateUSD : $scope.visitProcessProducts[productIndex].Price) * 100) / 100;
            $scope.visitProcessProducts[productIndex].total = Math.round((($scope.visitProcessProducts[productIndex].currencyType === EnumCurrencies.EUR ? $scope.visitProcessProducts[productIndex].Price * $scope.visitProcessProducts[productIndex].Rate : $scope.visitProcessProducts[productIndex].currencyType === EnumCurrencies.USD ? $scope.visitProcessProducts[productIndex].Price * $scope.visitProcessProducts[productIndex].RateUSD : $scope.visitProcessProducts[productIndex].Price) * $scope.visitProcessProducts[productIndex].Amount) * 100) / 100;

            if ($scope.visitProcessProducts[productIndex].discount > 0) {
                $scope.visitProcessProducts[productIndex].PriceEUR = Math.round(($scope.visitProcessProducts[productIndex].PriceEUR === 0 ? 0 : $scope.visitProcessProducts[productIndex].PriceEUR - ($scope.visitProcessProducts[productIndex].PriceEUR * ($scope.visitProcessProducts[productIndex].discount / 100))) * 100) / 100;
                $scope.visitProcessProducts[productIndex].PriceUSD = Math.round(($scope.visitProcessProducts[productIndex].PriceUSD === 0 ? 0 : $scope.visitProcessProducts[productIndex].PriceUSD - ($scope.visitProcessProducts[productIndex].PriceUSD * ($scope.visitProcessProducts[productIndex].discount / 100))) * 100) / 100;
                $scope.visitProcessProducts[productIndex].total = Math.round((($scope.visitProcessProducts[productIndex].PriceGEL - ($scope.visitProcessProducts[productIndex].PriceGEL * ($scope.visitProcessProducts[productIndex].discount / 100))) * $scope.visitProcessProducts[productIndex].Amount) * 100) / 100;
                $scope.visitProcessProducts[productIndex].PriceGEL = Math.round(($scope.visitProcessProducts[productIndex].PriceGEL - ($scope.visitProcessProducts[productIndex].PriceGEL * ($scope.visitProcessProducts[productIndex].discount / 100))) * 100) / 100;
            }
        }

        if ($scope.visitProcessProducts[productIndex].SaleTypeID === 1) { //შეცვლა
            $scope.visitProcessProducts[productIndex].PriceEUR = 0;
            $scope.visitProcessProducts[productIndex].PriceUSD = 0;
            $scope.visitProcessProducts[productIndex].PriceGEL = 0;
            $scope.visitProcessProducts[productIndex].total = 0;
        }
    }

    $scope.RemoveGeneratedResult = function (fakeId, grIndex) {
        var accepted = confirm('გინდათ წაშლა?');
        if (accepted) {
            var sel = $scope.GetFilteredGeneratedResults($scope.generatedResults)[grIndex];

            if (sel.ID !== undefined) {
                for (var i = 0; i < $scope.generatedResults.length; i++) {                    
                    if ($scope.generatedResults[i].fakeId === fakeId) {
                        if ($scope.generatedResults[i].ID !== undefined) {
                            $scope.generatedResults[i].Deleted = true;
                        } else {
                            $scope.generatedResults.splice(i, 1);
                        }
                    }
                }

                for (var i = 0; i < $scope.visitProcessProducts.length; i++) {
                    if ($scope.visitProcessProducts[i].fakeId === fakeId) {
                        if ($scope.visitProcessProducts[i].ID !== undefined) {
                            $scope.visitProcessProducts[i].Deleted = true;
                        } else {
                            $scope.visitProcessProducts.splice(i, 1);
                        }
                    }
                }
            } else {
                for (var i = 0; i < $scope.generatedResults.length; i++) {
                    if ($scope.generatedResults[i].fakeId === fakeId) {
                        $scope.generatedResults.splice(i, 1);
                    }
                }

                for (var i = 0; i < $scope.visitProcessProducts.length; i++) {
                    if ($scope.visitProcessProducts[i].fakeId === fakeId) {
                        $scope.visitProcessProducts.splice(i, 1);
                    }
                }              
            }
        }        
    }

    $scope.RemoveVisitProcessProduct = function (visitProcessProductIndex) {
        var accepted = confirm('გინდათ წაშლა?');
        if (accepted) {
            var toDel = $scope.visitProcessProducts[visitProcessProductIndex];

            if (toDel.ID > 0) {
                toDel.Deleted = true;
            } else {
                $scope.visitProcessProducts.splice(visitProcessProductIndex, 1);
            }
        }        
    }

    $scope.RemoveVisitProcess = function (visitProcessIndex) {
        var accepted = confirm('გინდათ წაშლა?');
        if (accepted) {
            var toDel = $scope.visitProcesses[visitProcessIndex];

            if (toDel.id > 0) {
                toDel.Deleted = true;
            } else {
                $scope.visitProcesses.splice(visitProcessIndex, 1);
            }
        }        
    }

    $scope.FinishProcess = function () {
        if ($scope.generatedResults.length > 0 || $scope.visitProcessProducts.length > 0) {
            $scope.showGeneratedTable = true;
            $scope.CloseActionsLayout();
            $scope.CloseEquipmentsLayout();
                        
            var visitProcess = {
                chosenEquipments: $scope.chosenEquipments,
                generatedResults: $scope.generatedResults,
                visitProcessProducts: $scope.visitProcessProducts,
                visitID: $scope.id
            };

            if ($scope.visitProcessID === 0 || $scope.visitProcessID === undefined) {
                $scope.visitProcesses.push(visitProcess);
            } else {
                visitProcess = GetModelByID($scope.visitProcesses, $scope.visitProcessID);
                visitProcess.chosenEquipments = $scope.chosenEquipments;
                visitProcess.generatedResults = $scope.generatedResults;
                visitProcess.visitProcessProducts = $scope.visitProcessProducts;
                visitProcess.visitID = $scope.id;
            }

            $scope.chosenEquipments = [];
            $scope.generatedResults = [];
            $scope.visitProcessProducts = [];
            $scope.equipments = [];            
            $scope.actions = [];
            $scope.actionItems = [];            

            $scope.showChosenEquipmentsTable = false;
            $scope.allChosenEquipmentsChecked = false;
            $scope.showFinalResultsTable = false;
        }
    }

    $scope.EditVisitProcess = function (visitProcess) {
        $scope.visitProcessID = visitProcess.id;
        $scope.chosenEquipments = UncheckItems(visitProcess.chosenEquipments);
        $scope.generatedResults = visitProcess.generatedResults;
        $scope.visitProcessProducts = visitProcess.visitProcessProducts;

        $scope.ShowEquipmentsLayout = true;
        $scope.showChosenEquipmentsTable = true;
        $scope.showFinalResultsTable = true;
    }

    $scope.ValidateVisitBools = function () {
        return ($scope.asPerContract || $scope.rent || $scope.sales || $scope.other1)
            && ($scope.inOffice || $scope.onSite)
            && ($scope.warranty || $scope.postWarranty || $scope.other2)
            && ($scope.toAccount || $scope.paymentOnDelivery || $scope.paid || $scope.warrantyPay || $scope.rentPay);
    }

    $scope.ValidateCheckBoxes1 = function () {
        if ($scope.asPerContract) {
            $scope.rent = false;
            $scope.sales = false;
            $scope.other1 = false;
        }else if ($scope.rent) {
            $scope.asPerContract = false;
            $scope.sales = false;
            $scope.other1 = false;
        }else if ($scope.sales) {
            $scope.rent = false;
            $scope.asPerContract = false;
            $scope.other1 = false;
        }else if ($scope.other1) {
            $scope.rent = false;
            $scope.asPerContract = false;
            $scope.sales = false;
        }
    }

    $scope.ValidateCheckBoxes2 = function () {
        if ($scope.inOffice) {
            $scope.onSite = false;
        } else if ($scope.onSite) {
            $scope.inOffice = false;
        }
    }

    $scope.ValidateCheckBoxes3 = function () {
        if ($scope.warranty) {
            $scope.postWarranty = false;
            $scope.other2 = false;
        } else if ($scope.postWarranty) {
            $scope.warranty = false;
            $scope.other2 = false;
        } else if ($scope.other2) {
            $scope.warranty = false;
            $scope.postWarranty = false;
        }
    }

    $scope.ValidateCheckBoxes4 = function () {
        if ($scope.toAccount) {
            $scope.paymentOnDelivery = false;
            $scope.paid = false;
            $scope.warrantyPay = false;
            $scope.rentPay = false;
        } else if ($scope.paymentOnDelivery) {
            $scope.toAccount = false;
            $scope.paid = false;
            $scope.warrantyPay = false;
            $scope.rentPay = false;
        } else if ($scope.paid) {
            $scope.toAccount = false;
            $scope.paymentOnDelivery = false;
            $scope.warrantyPay = false;
            $scope.rentPay = false;
        } else if ($scope.warrantyPay) {
            $scope.toAccount = false;
            $scope.paymentOnDelivery = false;
            $scope.paid = false;
            $scope.rentPay = false;
        } else if ($scope.rentPay) {
            $scope.toAccount = false;
            $scope.paymentOnDelivery = false;
            $scope.paid = false;
            $scope.warrantyPay = false;
        }
    }

    $scope.ValidateVisit = function () {
        var result = false;

        result = !IsNullOrEmpty($scope.visitDate);
        if (!result) {
            $('#visitDate').css('borderColor', '#FF2000');
        } else {
            $('#visitDate').css('borderColor', '#CCC');
        }

        result = !IsNullOrEmpty($scope.startTime);
        if (!result) {
            $('#startTime').css('borderColor', '#FF2000');
        } else {
            $('#startTime').css('borderColor', '#CCC');
        }

        result = !IsNullOrEmpty($scope.visitDate2);
        if (!result) {
            $('#visitDate2').css('borderColor', '#FF2000');
        } else {
            $('#visitDate2').css('borderColor', '#CCC');
        }

        result = !IsNullOrEmpty($scope.endTime);
        if (!result) {
            $('#endTime').css('borderColor', '#FF2000');
        } else {
            $('#endTime').css('borderColor', '#CCC');
        }

        return result;
    }

    $scope.SaveVisit = function (deleted) {        
        if ($scope.visitProcesses.length > 0) {
            if ($scope.ValidateVisitBools()) {
                if (window.navigator.onLine) {
                    if ($scope.ValidateVisit()) {
                        var visit = {
                            ID: $scope.id,
                            CreateDate: $scope.createDate === undefined ? $scope.firstCreateDate : $scope.createDate,
                            EndDate: $scope.endDate,
                            ContragentID: $scope.selectedContragent.id,
                            VisitProcesses: $scope.visitProcesses,
                            ContragentSignature: contragentSignature,
                            CreatorUserSignature: userSignature,
                            Comment: $scope.Comment,
                            SubContragentId: $scope.selectedSubContragent.id,
                            protocolId: $scope.protocolId,
                            warranty: $scope.warranty,
                            postWarranty: $scope.postWarranty,
                            inOffice: $scope.inOffice,
                            onSite: $scope.onSite,
                            asPerContract: $scope.asPerContract,
                            rent: $scope.rent,
                            sales: $scope.sales,
                            paid: $scope.paid,
                            toAccount: $scope.toAccount,
                            paymentOnDelivery: $scope.paymentOnDelivery,
                            other1: $scope.other1,
                            other2: $scope.other2,
                            warrantyPay: $scope.warrantyPay,
                            rentPay: $scope.rentPay,
                            visitDate: $scope.visitDate,
                            visitDate2: $scope.visitDate2,
                            startTime: $scope.startTime,
                            endTime: $scope.endTime,
                            clientFullName: $scope.clientFullName,
                            Deleted: deleted,
                            waybillFilter: app.waybillFilter
                        }

                        $scope.ShowLoader = true;
                        $http.post('/Home/SaveVisit', { visit: visit }).then(function (response) {
                            if (response.data.saveResult && response.data.rsResult && response.data.sendResult) {
                                location.href = '/Home/Visits';
                            } else {
                                if (!response.data.saveResult) {
                                    alert("მონაცემები ვერ შეინახა!");
                                    $scope.ShowLoader = false;
                                }

                                if (!response.data.rsResult) {
                                    alert("ზედნადები ვერ აიტვირთა RS-ზე!")
                                    $scope.ShowLoader = false;
                                }

                                if (!response.data.sendResult) {
                                    alert("ფოსტაზე ვერ გაიგზავნა!");
                                    $scope.ShowLoader = false;
                                }
                            }
                        });
                    }
                } else {
                    alert('სერვერთან წვდომა შეუძლებელია, გთხოვთ შეამოწმოთ ინტერნეტ კავშირი და სცადოთ შენახვა კიდევ ერთხელ.');
                }
            } else {
                alert('მონიშნეთ ყველა ბლოკიდან ერთი მაინც!');
            }
        }
    }

    $scope.CloseVisit = function () {
        var accepted = confirm('გინდათ გასვლა?');
        if (accepted) {
            location.href = '/Home/Visits';
        }
    }

    $scope.DeleteVisit = function () {
        var accepted = confirm('გინდათ წაშლა?');
        if (accepted) {
            $scope.SaveVisit(true);
        }
    }

    $scope.AddProvidedService = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'ProvidedServiceModal.html',
            controller: 'ProvidedServiceModalController',
            size: 'lg',
            backdrop: 'static'
        });
    }

    $scope.OpenVisitSignatureLayout = function () {
        if (!IsNullOrEmpty($scope.clientFullName)) {
            $scope.ShowVisitPreSignatureLayout = false;
            $scope.ShowVisitSignatureLayout = true;

            var canvasContragent = document.getElementById("contragentSignature"),
                canvasUser = document.getElementById("userSignature");

            function initializeCanvases() {
                canvasContragent.width = $window.innerWidth;
                canvasContragent.height = ($window.innerHeight / 2) - 50;
                canvasContragent.getContext("2d").scale(1, 1);

                canvasUser.width = $window.innerWidth;
                canvasUser.height = ($window.innerHeight / 2) - 50;
                canvasUser.getContext("2d").scale(1, 1);
            }

            initializeCanvases();

            signaturePadContragent = new SignaturePad(canvasContragent);
            signaturePadContragent.velocityFilterWeight = 1.5;
            signaturePadUser = new SignaturePad(canvasUser);
            signaturePadUser.velocityFilterWeight = 1.5;

            signaturePadContragent.fromDataURL(contragentSignature);
            signaturePadUser.fromDataURL(userSignature);
        } else {
            $('#txtClientFullName').css('borderColor', '#FF2000');
        }
    }

    $scope.SaveAndCloseVisitSignatureLayout = function () {       
        contragentSignature = signaturePadContragent.points.length === 0 ? $scope.contragentSignature : signaturePadContragent.toDataURL();
        userSignature = signaturePadUser.points.length === 0 ? $scope.userSignature : signaturePadUser.toDataURL();

        $scope.ShowVisitSignatureLayout = false;
    }

    $scope.ClearContragentSignature = function () {
        signaturePadContragent.clear();
        contragentSignature = '';
    }

    $scope.ClearUserSignature = function () {
        signaturePadUser.clear();
        userSignature = '';
    }

    $scope.ClearSignatures = function () {
        var accepted = confirm('გინდათ ხელმოწერების ამოშლა?');
        if (accepted) {
            contragentSignature = '';
            userSignature = '';
            contragentProtocolSignature = '';
            userProtocolSignature = '';

            $scope.ShowLoader = true;
            $http.post('/Home/ClearSignatures', { visitId: $scope.id }).then(function (response) {
                if (response.data.saveResult) $scope.ShowLoader = false;
            });
        }        
    }

    $scope.FilterNotDeleted = function (item) {
        return item.Deleted === false || item.Deleted === undefined;
    }

    $scope.SendEmailToContragent = function () {
        var accepted = confirm('გინდათ ელ-ფოსტაზე გაგზავნა?');
        if (accepted) {
            $scope.ShowLoader = true;
            $http.post('/Home/SendContragentEmail', { visitID: $scope.id }).then(function (response) {
                $scope.ShowLoader = false;
            });
        }        
    }

    $scope.GeneratedResultsLength = function () {
        var res = 0;

        angular.forEach($scope.generatedResults, function (gr) {
            if (!gr.Deleted && gr.Text !== null) {
                res++;
            }
        });

        return res;
    }
    $scope.VisitProcessProductsLength = function () {
        var result = GetNotDeletedObjects($scope.visitProcessProducts);
        return result.length;
    }

    app.PushProvidedService = function (providedService, discount, quantity) {
        var provServ = {
            VisitProcessID: $scope.visitProcessID,
            ProductID: providedService.ID,
            ProductName: providedService.groupName,
            subActionItemName: providedService.Name,
            SaleTypeID: 6, //Provided service,
            Amount: quantity,
            //PriceEUR: providedService.Price == null ? 0 : providedService.Price * $scope.rate,
            //PriceUSD: providedService.Price == null ? 0 : providedService.Price * $scope.rateUSD,
            //PriceGEL: providedService.Price == null ? 0 : providedService.Price,
            //Price: providedService.Price == null ? 0 : providedService.Price,
            Rate: $scope.rate,
            RateUSD: $scope.rateUSD,

            PriceEUR: providedService.currencyType === EnumCurrencies.EUR ? providedService.Price : 0,
            PriceUSD: providedService.currencyType === EnumCurrencies.USD ? providedService.Price : 0,
            PriceGEL: Math.round((providedService.currencyType === EnumCurrencies.EUR ? providedService.Price * $scope.rate : providedService.currencyType === EnumCurrencies.USD ? providedService.Price * $scope.rateUSD : providedService.Price) * 100) / 100,
            Price: providedService.Price == null ? 0 : providedService.Price,
            total: Math.round(((providedService.currencyType === EnumCurrencies.EUR ? providedService.Price * $scope.rate : providedService.currencyType === EnumCurrencies.USD ? providedService.Price * $scope.rateUSD : providedService.Price) * parseInt(quantity)) * 100) / 100,
            discount: discount,
            productCode: providedService.Code,
            unitName: providedService.unitName
        }        

        if (discount > 0) {
            //provServ.PriceEUR = Math.round((provServ.PriceEUR === 0 ? 0 : provServ.PriceEUR - (provServ.PriceEUR * (discount / 100))) * 100) / 100;
            //provServ.PriceUSD = Math.round((provServ.PriceUSD === 0 ? 0 : provServ.PriceUSD - (provServ.PriceUSD * (discount / 100))) * 100) / 100;
            provServ.total = Math.round(((provServ.PriceGEL - (provServ.PriceGEL * (discount / 100))) * provServ.Amount) * 100) / 100;
            //provServ.PriceGEL = Math.round((provServ.PriceGEL - (provServ.PriceGEL * (discount / 100))) * 100) / 100;
        }

        $scope.visitProcessProducts.push(provServ);

        $scope.showFinalResultsTable = true;
    }

    $scope.ValidateVisitProcessProducts = function (visitProcessProduct) {
        var result = false;

        if (visitProcessProduct.EquipmentID === undefined && visitProcessProduct.ActionItemID === undefined || visitProcessProduct.EquipmentID === null && visitProcessProduct.ActionItemID === null) {
            result = true;
        }

        return result;
    }

    $scope.GetStoreName = function (storeId) {
        if (!IsNullOrEmpty(storeId))
            return GetModelByID($scope.stores, storeId) === null ? '' : GetModelByID($scope.stores, storeId).Name;
        else
            return '';
    }

    $scope.HideWithoutStore = function (storeId) {
        return IsNullOrEmpty(storeId);
    }

    $scope.OpenVisitPreSignatureLayout = function () {
        if ($scope.visitProcesses.length > 0) {
            $scope.ShowVisitPreSignatureLayout = true;
        }            
    }

    $scope.OpenProtocolPreSignatureLayout = function () {
        if ($scope.visitProcesses.length > 0) {
            $scope.ShowProtocolLayout = false;
            $scope.ShowProtocolPreSignatureLayout = true;
        }
    }

    $scope.AddProduct = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'ProductModal.html',
            controller: 'ProductModalController',
            size: 'lg',
            backdrop: 'static'
        });

        modalInstance.saleTypes = $scope.saleTypes;
        modalInstance.stores = $scope.stores;
    }



    //Protocols start   
    $scope.selectedSubProtocolStatus = 0;

    $scope.openDatepicker = function ($event) {
        $scope.date_opened = true;
    };

    $scope.dateOptions = {
        startingDay: 1
    };

    $scope.OpenProtocolsLayout = function () {
        $scope.protocolDate = moment().format('YYYY-MM-DD HH:mm:ss');

        $scope.ShowProtocolLayout = true;
    }

    $scope.ResetSubProtocol = function () {
        $scope.selectedSubProtocolStatus = 0;
        $scope.casinoNumber = '';
        $scope.serialNumber = '';
        $scope.platformNumber = '';
        $scope.plombNumber = '';
        $scope.bet = '';
        $scope.win = '';
        $scope.electricIn = '';
        $scope.electricOut = '';
        $scope.games = '';
        $scope.mechanicIn = '';
        $scope.mechanicOut = '';
    }

    $scope.ValidateSubProtocol = function () {
        var result = true;

        result = result && !IsNullOrEmpty($scope.casinoNumber);
        if (!result) {
            $('#casinoNumber').css('borderColor', '#FF2000');
        } else {
            $('#casinoNumber').css('borderColor', '#CCC');
        }

        result = result && !IsNullOrEmpty($scope.serialNumber);
        if (!result) {
            $('#serialNumber').css('borderColor', '#FF2000');
        } else {
            $('#serialNumber').css('borderColor', '#CCC');
        }

        result = result && !IsNullOrEmpty($scope.platformNumber);
        if (!result) {
            $('#platformNumber').css('borderColor', '#FF2000');
        } else {
            $('#platformNumber').css('borderColor', '#CCC');
        }

        result = result && !IsNullOrEmpty($scope.bet);
        if (!result) {
            $('#bet').css('borderColor', '#FF2000');
        } else {
            $('#bet').css('borderColor', '#CCC');
        }

        result = result && !IsNullOrEmpty($scope.win);
        if (!result) {
            $('#win').css('borderColor', '#FF2000');
        } else {
            $('#win').css('borderColor', '#CCC');
        }

        result = result && !IsNullOrEmpty($scope.electricIn);
        if (!result) {
            $('#electricIn').css('borderColor', '#FF2000');
        } else {
            $('#electricIn').css('borderColor', '#CCC');
        }

        result = result && !IsNullOrEmpty($scope.electricOut);
        if (!result) {
            $('#electricOut').css('borderColor', '#FF2000');
        } else {
            $('#electricOut').css('borderColor', '#CCC');
        }

        result = result && !IsNullOrEmpty($scope.games);
        if (!result) {
            $('#games').css('borderColor', '#FF2000');
        } else {
            $('#games').css('borderColor', '#CCC');
        }

        result = result && !IsNullOrEmpty($scope.mechanicIn);
        if (!result) {
            $('#mechanicIn').css('borderColor', '#FF2000');
        } else {
            $('#mechanicIn').css('borderColor', '#CCC');
        }

        result = result && result && !IsNullOrEmpty($scope.mechanicOut);
        if (!result) {
            $('#mechanicOut').css('borderColor', '#FF2000');
        } else {
            $('#mechanicOut').css('borderColor', '#CCC');
        }

        return result;
    }

    $scope.AddSubProtocol = function () {
        if ($scope.ValidateSubProtocol()) {
            $scope.protocol.subProtocols.push({
                status: $scope.selectedSubProtocolStatus,
                casinoNumber: $scope.casinoNumber,
                serialNumber: $scope.serialNumber,
                platformNumber: $scope.platformNumber,
                plombNumber: $scope.plombNumber,
                bet: $scope.bet,
                win: $scope.win,
                electricIn: $scope.electricIn,
                electricOut: $scope.electricOut,
                games: $scope.games,
                mechanicIn: $scope.mechanicIn,
                mechanicOut: $scope.mechanicOut
            });

            $scope.ResetSubProtocol();
        }
    }

    $scope.SaveAndCloseProtocolLayout = function () {
        if ($scope.selectedEquipmentTypes.length >= 1 && $scope.selectedProgramVersions.length >= 1) {
            $scope.ShowLoader = true;
            $scope.protocol.contragentSignature = contragentProtocolSignature;
            $scope.protocol.technicalSignature = userProtocolSignature;

            $scope.protocol.equipmentTypeIds = GetFieldsFromObjectsCollection($scope.selectedEquipmentTypes, 'id');
            $scope.protocol.programVersionIds = GetFieldsFromObjectsCollection($scope.selectedProgramVersions, 'id');

            $http.post('/Home/SaveProtocol', { protocol: $scope.protocol }).then(function (response) {
                if ($scope.selectedEquipmentTypes.length <= 8 && $scope.selectedProgramVersions.length <= 8) {
                    $scope.protocolId = response.data.id;

                    $scope.ShowLoader = false;
                    $scope.ShowProtocolLayout = false;
                } else {
                    alert('არჩეული აპარატის ტიპის და პროგრამის ვერსიის რაოდენობა არ უნდა აღემატებოდეს 8-ს!');
                }
            });
        } else {
            alert('აპარატის ტიპი და პროგრამის ვერსია აუცილებელია!');
        }
    }

    $scope.OpenProtocolSignatureLayout = function () {
        $scope.ShowProtocolSignatureLayout = true;

        var canvasProtocolContragent = document.getElementById("contragentProtocolSignature"),
            canvasProtocolUser = document.getElementById("userProtocolSignature");

        function initializeProtocolCanvases() {
            canvasProtocolContragent.width = $window.innerWidth;
            canvasProtocolContragent.height = ($window.innerHeight / 2) - 50;
            canvasProtocolContragent.getContext("2d").scale(1, 1);

            canvasProtocolUser.width = $window.innerWidth;
            canvasProtocolUser.height = ($window.innerHeight / 2) - 50;
            canvasProtocolUser.getContext("2d").scale(1, 1);
        }

        initializeProtocolCanvases();

        signaturePadProtocolContragent = new SignaturePad(canvasProtocolContragent);
        signaturePadProtocolContragent.velocityFilterWeight = 1.5;
        signaturePadProtocolUser = new SignaturePad(canvasProtocolUser);
        signaturePadProtocolUser.velocityFilterWeight = 1.5;

        signaturePadProtocolContragent.fromDataURL(contragentProtocolSignature);
        signaturePadProtocolUser.fromDataURL(userProtocolSignature);
    }

    $scope.SaveAndCloseProtocolSignatureLayout = function () {
        contragentProtocolSignature = signaturePadProtocolContragent.points.length === 0 ? $scope.contragentProtocolSignature : signaturePadProtocolContragent.toDataURL();
        userProtocolSignature = signaturePadProtocolUser.points.length === 0 ? $scope.userProtocolSignature : signaturePadProtocolUser.toDataURL();

        $scope.ShowProtocolPreSignatureLayout = false;
        $scope.ShowProtocolSignatureLayout = false;
        $scope.ShowProtocolLayout = true;
    }

    $scope.ClearContragentProtocolSignature = function () {
        signaturePadProtocolContragent.clear();
        contragentProtocolSignature = '';        
    }

    $scope.ClearUserProtocolSignature = function () {
        signaturePadProtocolUser.clear();
        userProtocolSignature = '';
    }

    $scope.subProtocolStatuses = [
        '',
        'ძველი',
        'ახალი'
    ]

    $scope.SelectSubProtocolStatus = function (subProtocolStatusIndex) {
        $scope.selectedSubProtocolStatus = subProtocolStatusIndex;
    }
    
    $scope.ManageSelectedEquipmentTypes = function () {
        if ($scope.selectedEquipmentTypes.length === 8) {
            angular.forEach($scope.equipmentTypes, function (et) {
                if (!et.ticked) {
                    et.disabled = true;
                }
            });
        } else if ($scope.selectedEquipmentTypes.length < 8) {
            angular.forEach($scope.equipmentTypes, function (et) {
                et.disabled = false;
            });
        }
    }
    $scope.ManageSelectedProgramVersions = function () {
        if ($scope.selectedProgramVersions.length === 8) {
            angular.forEach($scope.programVersions, function (pv) {
                if (!pv.ticked) {
                    pv.disabled = true;
                }
            });
        } else if ($scope.selectedProgramVersions.length < 8) {
            angular.forEach($scope.programVersions, function (pv) {
                pv.disabled = false;
            });
        }
    }
    //Protocols end
});


app.controller('ChosenEquipmentModalController', function ($scope, $modalInstance) {
    var dt = moment();

    $scope.openDatepicker = function ($event) {
        $scope.dtpr_opened = true;
    };

    $scope.dateOptions = {
        startingDay: 1
    };

    $scope.init = function () {
        $('#txtDoorOpenTime').timeEntry({ show24Hours: true, noSeparatorEntry: true });
    }

    $scope.EquipmentID = $modalInstance.EquipmentID;
    $scope.equipmentName = $modalInstance.equipmentName;

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.equipmentSeries = $modalInstance.equipmentSeries;
    $scope.doorOpenDate = $modalInstance.doorOpenDate;
    $scope.doorOpenTime = $modalInstance.doorOpenTime;
    $scope.equipmentGroupID = $modalInstance.equipmentGroupID;
    $scope.equipmentIndex = $modalInstance.equipmentIndex;

    $scope.Validate = function () {
        var result = false;

        result = !IsNullOrEmpty($scope.equipmentSeries);
        if (!result) {
            $('#txtEquipmentSeries').css('borderColor', '#FF2000');
        } else {
            $('#txtEquipmentSeries').css('borderColor', '#CCC');
        }

        //result = result && !IsNullOrEmpty($scope.doorOpenDate);
        //if (!result) {
        //    $('#txtDoorOpenDate').css('borderColor', '#FF2000');
        //} else {
        //    $('#txtDoorOpenDate').css('borderColor', '#CCC');
        //}

        //result = result && !IsNullOrEmpty($scope.doorOpenTime);
        //if (!result) {
        //    $('#txtDoorOpenTime').css('borderColor', '#FF2000');
        //} else {
        //    $('#txtDoorOpenTime').css('borderColor', '#CCC');
        //}

        return result;
    }

    $scope.Save = function () {
        if ($scope.Validate()) {
            app.PushChosenEquipments({
                EquipmentID: $scope.EquipmentID,
                Name: $scope.equipmentName,
                EquipmentSeries: $scope.equipmentSeries,
                DoorOpenDate: $scope.doorOpenDate === null || $scope.doorOpenDate === '' ? '' :moment($scope.doorOpenDate).format('YYYY-MM-DD'),
                DoorOpenTime: $scope.doorOpenTime,
                EquipmentGroupID: $scope.equipmentGroupID
            }, $scope.equipmentIndex);

            $scope.Cancel();
        }
    };
});


app.controller('ChosenProductModalController', function ($scope, $modalInstance, $http, $modal) {
    $scope.productId = $modalInstance.productId;
    $scope.productName = $modalInstance.productName;
    $scope.saleTypes = $modalInstance.saleTypes;
    $scope.selectedSaleTypeIndex = $modalInstance.selectedSaleTypeIndex;
    $scope.amount = $modalInstance.amount;
    $scope.OldSeries = $modalInstance.OldSeries;
    $scope.NewSeries = $modalInstance.NewSeries;
    $scope.stores = $modalInstance.stores;
    $scope.selectedStoreIndex = 0;
    $scope.discount = $modalInstance.discount;
    $scope.currencyType = $modalInstance.currencyType;
    $scope.unitName = $modalInstance.unitName;
    $scope.productCode = $modalInstance.productCode;
    $scope.product = $modalInstance.product;

    $scope.calledFromGR = $modalInstance.calledFromGR;

    $scope.SelectSaleType = function (saleTypeIndex) {
        if (saleTypeIndex !== 6) {//ProvideService
            $scope.selectedSaleTypeIndex = saleTypeIndex;
        } else {
            alert('ტიპის არჩევა (მომსახურების გაწევა) საქონელზე შეუძლებელია!');
        }
    }

    $scope.SelectStore = function (storeIndex) {
        if ($scope.selectedSaleTypeIndex === 5) { //ჩამოწერა
            if ($scope.stores[storeIndex].Path === '0#1#4') { //ბორტი
                alert('ბორტიდან ჩამოწერა შეუძლებელია!');
            } else {
                $scope.selectedStoreIndex = storeIndex;
            }
        } else {
            $scope.selectedStoreIndex = storeIndex;            
        }

        if ($scope.stores[storeIndex].Path !== '0#1#4') {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'WaybillModal.html',
                controller: 'WaybillModalController',
                size: 'md',
                backdrop: 'static'
            });
        }
    }

    $scope.Validate = function () {
        var result = false;

        result = !IsUndefinedNullOrEmpty($scope.amount);
        if (!result) {
            $('#txtProductAmount').css('borderColor', '#FF2000');
        } else {
            $('#txtProductAmount').css('borderColor', '#CCC');
        }

        if ($scope.discount === '' || $scope.discount === null || $scope.discount === undefined) {
            result = false;
            $('#txtProductDiscount').css('borderColor', '#FF2000');
        } else {
            result = true;
            $('#txtProductDiscount').css('borderColor', '#CCC');
        }

        
        if (result) {
            if ($scope.selectedSaleTypeIndex === 5) { //ჩამოწერა
                if ($scope.stores[$scope.selectedStoreIndex].Path === '0#1#4') { //ბორტი
                    result = false;
                    alert('ბორტიდან ჩამოწერა შეუძლებელია!');
                }
            }
        }


        //if (!IsUndefinedNullOrEmpty($scope.OldSeries)) {
        //    result = !IsUndefinedNullOrEmpty($scope.NewSeries);
        //    if (!result) {
        //        $('#txtProductNewSeries').css('borderColor', '#FF2000');
        //    } else {
        //        $('#txtProductNewSeries').css('borderColor', '#CCC');
        //    }
        //}

        //if (!IsUndefinedNullOrEmpty($scope.NewSeries)) {
        //    result = !IsUndefinedNullOrEmpty($scope.OldSeries);
        //    if (!result) {
        //        $('#txtProductOldSeries').css('borderColor', '#FF2000');
        //    } else {
        //        $('#txtProductOldSeries').css('borderColor', '#CCC');
        //    }
        //}

        return result;
    }    

    $scope.Save = function () {
        if ($scope.Validate()) {
            if ($scope.selectedSaleTypeIndex === 0 && $scope.stores[$scope.selectedStoreIndex].Path === '0#1#4') { //რეალიზაცია და ბორტი
                if (app.selectedContragentCode == "204536225") {
                    alert('კომპანიაზე EGT არ გაქვთ რეალიზაციის უფლება!');
                } else {
                    $http.post('/Home/CheckWaybill', { bortNumber: $scope.stores[$scope.selectedStoreIndex].Name }).then(function (resp) { //ამოწმებს ატვირთულია თუ არა დისტრიბუციის ზედნადები Rs.ge-ზე
                        if (resp.data) { //მშობელი ზედნადები ატვირთულია
                            $http.post('/Home/GetProductRest', { productIds: [$scope.productId], storeId: $scope.stores[$scope.selectedStoreIndex].Id }).then(function (resp) { //ამოწმებს მოცემული საქონელი მოცემულ ბორტზე არის თუ არა ამ რაოდენობით და საერთოდ
                                if (resp.data.productId === 0) { //მითითებულ ბორტზე არ არის მოცემული საქონელი
                                    alert('მოცემული საქონელი არ არის მითითებულ ბორტზე!');
                                } else {
                                    if ($scope.amount > resp.data.quantity) { //ბორტზე არ არის მოცემული რაოდენობის საქონელი დარჩენილი
                                        alert('მითითებულ ბორტზე დარჩენილია ' + resp.data.quantity + ' რაოდენობის მოცემული საქონელი!');
                                    } else {
                                        $scope.pushProds();
                                    }
                                }
                            });
                        } else { //მშობელი ზედნადები არ არის ატვირთული
                            alert('დისტრიბუციის ზედნადები არ არის ატვირთული Rs.ge-ზე!');
                        }
                    });
                }
            }

            if ($scope.selectedSaleTypeIndex === 0 && $scope.stores[$scope.selectedStoreIndex].Path === '0#1#2') { //რეალიზაცია და არა ბორტი ანუ რომელიმე საწყობი
                if (app.selectedContragentCode == "204536225") {
                    alert('კომპანიაზე EGT არ გაქვთ რეალიზაციის უფლება!');
                } else {
                    $http.post('/Home/GetProductRest', { productIds: [$scope.productId], storeId: $scope.stores[$scope.selectedStoreIndex].Id }).then(function (resp) { //ამოწმებს მოცემული საქონელი მოცემულ საწყობში არის თუ არა ამ რაოდენობით და საერთოდ
                        if (resp.data.productId === 0) { //მითითებულ საწყობში არ არის მოცემული საქონელი
                            alert('მოცემული საქონელი არ არის მითითებულ საწყობში!');
                        } else {
                            if ($scope.amount > resp.data.quantity) { //საწყობში არ არის მოცემული რაოდენობის საქონელი დარჩენილი
                                alert('მითითებულ საწყობში დარჩენილია ' + resp.data.quantity + ' რაოდენობის მოცემული საქონელი!');
                            } else {
                                $scope.pushProds();
                            }
                        }
                    });
                }
            }

            if ($scope.selectedSaleTypeIndex === 1 && $scope.stores[$scope.selectedStoreIndex].Path === '0#1#4') { //შეცვლა და ბორტი
                $http.post('/Home/GetProductRest', { productIds: [$scope.productId], storeId: $scope.stores[$scope.selectedStoreIndex].Id }).then(function (resp) { //ამოწმებს მოცემული საქონელი მოცემულ ბორტზე არის თუ არა ამ რაოდენობით და საერთოდ
                    if (resp.data.productId === 0) { //მითითებულ ბორტზე არ არის მოცემული საქონელი
                        alert('მოცემული საქონელი არ არის მითითებულ ბორტზე!');
                    } else {
                        if ($scope.amount > resp.data.quantity) { //ბორტზე არ არის მოცემული რაოდენობის საქონელი დარჩენილი
                            alert('მითითებულ ბორტზე დარჩენილია ' + resp.data.quantity + ' რაოდენობის მოცემული საქონელი!');
                        } else {
                            $scope.pushProds();
                        }
                    }
                });
            }

            if ($scope.selectedSaleTypeIndex === 1 && $scope.stores[$scope.selectedStoreIndex].Path === '0#1#2') { //შეცვლა და საწყობი
                $http.post('/Home/GetProductRest', { productIds: [$scope.productId], storeId: $scope.stores[$scope.selectedStoreIndex].Id }).then(function (resp) { //ამოწმებს მოცემული საქონელი მოცემულ საწყობში არის თუ არა ამ რაოდენობით და საერთოდ
                    if (resp.data.productId === 0) { //მითითებულ საწყობში არ არის მოცემული საქონელი
                        alert('მოცემული საქონელი არ არის მითითებულ საწყობში!');
                    } else {
                        if ($scope.amount > resp.data.quantity) { //საწყობში არ არის მოცემული რაოდენობის საქონელი დარჩენილი
                            alert('მითითებულ საწყობში დარჩენილია ' + resp.data.quantity + ' რაოდენობის მოცემული საქონელი!');
                        } else {
                            $scope.pushProds();
                        }
                    }
                });
            }

            if ($scope.selectedSaleTypeIndex === 2 && $scope.stores[$scope.selectedStoreIndex].Path === '0#1#4') { //დამატება და ბორტი
                if (app.selectedContragentCode == "204536225") {
                    alert('კომპანიაზე EGT არ გაქვთ დამატების უფლება!');
                } else {
                    $http.post('/Home/CheckMoveWaybill', { bortNumber: $scope.stores[$scope.selectedStoreIndex].Name }).then(function (resp) { //ამოწმებს ატვირთულია თუ არა შიდაგადაადგილების ზედნადები Rs.ge-ზე
                        if (resp.data) { //შიდაგადაადგილების ზედნადები ატვირთულია
                            $http.post('/Home/GetProductRest', { productIds: [$scope.productId], storeId: $scope.stores[$scope.selectedStoreIndex].Id }).then(function (resp) { //ამოწმებს მოცემული საქონელი მოცემულ ბორტზე არის თუ არა ამ რაოდენობით და საერთოდ
                                if (resp.data.productId === 0) { //მითითებულ ბორტზე არ არის მოცემული საქონელი
                                    alert('მოცემული საქონელი არ არის მითითებულ ბორტზე!');
                                } else {
                                    if ($scope.amount > resp.data.quantity) { //ბორტზე არ არის მოცემული რაოდენობის საქონელი დარჩენილი
                                        alert('მითითებულ ბორტზე დარჩენილია ' + resp.data.quantity + ' რაოდენობის მოცემული საქონელი!');
                                    } else {
                                        $scope.pushProds();
                                    }
                                }
                            });
                        } else { //შიდაგადაადგილების ზედნადები არ არის ატვირთული
                            alert('შიდა გადაადგილების ზედნადები არ არის ატვირთული Rs.ge-ზე!');
                        }
                    });
                }
            }

            if ($scope.selectedSaleTypeIndex === 3 && $scope.stores[$scope.selectedStoreIndex].Path === '0#1#4') { //მოხსნა და ბორტი
                if (app.selectedContragentCode == "204536225") {
                    alert('კომპანიაზე EGT არ გაქვთ მოხსნის უფლება!');
                } else {
                    $http.post('/Home/CheckMoveWaybill', { bortNumber: $scope.stores[$scope.selectedStoreIndex].Name }).then(function (resp) { //ამოწმებს ატვირთულია თუ არა შიდაგადაადგილების ზედნადები Rs.ge-ზე
                        if (resp.data) { //შიდაგადაადგილების ზედნადები ატვირთულია
                            $http.post('/Home/GetProductRest', { productIds: [$scope.productId], storeId: $scope.stores[$scope.selectedStoreIndex].Id }).then(function (resp) { //ამოწმებს მოცემული საქონელი მოცემულ ბორტზე არის თუ არა ამ რაოდენობით და საერთოდ
                                if (resp.data.productId === 0) { //მითითებულ ბორტზე არ არის მოცემული საქონელი
                                    alert('მოცემული საქონელი არ არის მითითებულ ბორტზე!');
                                } else {
                                    if ($scope.amount > resp.data.quantity) { //ბორტზე არ არის მოცემული რაოდენობის საქონელი დარჩენილი
                                        alert('მითითებულ ბორტზე დარჩენილია ' + resp.data.quantity + ' რაოდენობის მოცემული საქონელი!');
                                    } else {
                                        $scope.pushProds();
                                    }
                                }
                            });
                        } else { //შიდაგადაადგილების ზედნადები არ არის ატვირთული
                            alert('შიდა გადაადგილების ზედნადები არ არის ატვირთული Rs.ge-ზე!');
                        }
                    });                    
                }
            }

            if ($scope.selectedSaleTypeIndex === 4 && $scope.stores[$scope.selectedStoreIndex].Path === '0#1#4') { //გახარჯვა და ბორტი
                $http.post('/Home/CheckWaybill', { bortNumber: $scope.stores[$scope.selectedStoreIndex].Name }).then(function (resp) { //ამოწმებს ატვირთულია თუ არა დისტრიბუციის ზედნადები Rs.ge-ზე
                    if (resp.data) { //მშობელი ზედნადები ატვირთულია
                        $http.post('/Home/GetProductRest', { productIds: [$scope.productId], storeId: $scope.stores[$scope.selectedStoreIndex].Id }).then(function (resp) { //ამოწმებს მოცემული საქონელი მოცემულ ბორტზე არის თუ არა ამ რაოდენობით და საერთოდ
                            if (resp.data.productId === 0) { //მითითებულ ბორტზე არ არის მოცემული საქონელი
                                alert('მოცემული საქონელი არ არის მითითებულ ბორტზე!');
                            } else {
                                if ($scope.amount > resp.data.quantity) { //ბორტზე არ არის მოცემული რაოდენობის საქონელი დარჩენილი
                                    alert('მითითებულ ბორტზე დარჩენილია ' + resp.data.quantity + ' რაოდენობის მოცემული საქონელი!');
                                } else {
                                    $scope.pushProds();
                                }
                            }
                        });
                    } else { //მშობელი ზედნადები არ არის ატვირთული
                        alert('დისტრიბუციის ზედნადები არ არის ატვირთული Rs.ge-ზე!');
                    }
                });                
            }

            if ($scope.selectedSaleTypeIndex === 4 && $scope.stores[$scope.selectedStoreIndex].Path === '0#1#2') { //გახარჯვა და საწყობი
                $http.post('/Home/GetProductRest', { productIds: [$scope.productId], storeId: $scope.stores[$scope.selectedStoreIndex].Id }).then(function (resp) { //ამოწმებს მოცემული საქონელი მოცემულ საწყობში არის თუ არა ამ რაოდენობით და საერთოდ
                    if (resp.data.productId === 0) { //მითითებულ საწყობში არ არის მოცემული საქონელი
                        alert('მოცემული საქონელი არ არის მითითებულ საწყობში!');
                    } else {
                        if ($scope.amount > resp.data.quantity) { //საწყობში არ არის მოცემული რაოდენობის საქონელი დარჩენილი
                            alert('მითითებულ საწყობში დარჩენილია ' + resp.data.quantity + ' რაოდენობის მოცემული საქონელი!');
                        } else {
                            $scope.pushProds();
                        }
                    }
                });
            }

            if ($scope.selectedSaleTypeIndex === 5 && $scope.stores[$scope.selectedStoreIndex].Path === '0#1#2') { //ჩამოწერა და საწყობი
                $http.post('/Home/GetProductRest', { productIds: [$scope.productId], storeId: $scope.stores[$scope.selectedStoreIndex].Id }).then(function (resp) { //ამოწმებს მოცემული საქონელი მოცემულ საწყობში არის თუ არა ამ რაოდენობით და საერთოდ
                    if (resp.data.productId === 0) { //მითითებულ საწყობში არ არის მოცემული საქონელი
                        alert('მოცემული საქონელი არ არის მითითებულ საწყობში!');
                    } else {
                        if ($scope.amount > resp.data.quantity) { //საწყობში არ არის მოცემული რაოდენობის საქონელი დარჩენილი
                            alert('მითითებულ საწყობში დარჩენილია ' + resp.data.quantity + ' რაოდენობის მოცემული საქონელი!');
                        } else {
                            $scope.pushProds();
                        }
                    }
                });
            }
        }
    }

    $scope.pushProds = function () {       
        if ($scope.calledFromGR) {
            app.PushChosenProduct($scope.selectedSaleTypeIndex, $scope.amount, $scope.OldSeries, $scope.NewSeries, $scope.stores[$scope.selectedStoreIndex].Id, $scope.discount, $scope.currencyType, $scope.unitName, $scope.productCode);
        } else {
            app.pushToVisitProcessProducts($scope.product, $scope.selectedSaleTypeIndex, $scope.amount, $scope.NewSeries, $scope.stores[$scope.selectedStoreIndex].Id, $scope.discount);
        }
        
        $scope.Cancel();
    }

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


app.controller('WaybillModalController', function ($scope, $modalInstance) {

    $scope.types = [
        {
            id: 3,
            name: 'ტრანსპორტირების გარეშე'
        }, {
            id: 2,
            name: 'ტრანსპორტირებით'
        }
    ];
    $scope.transTypes = [
        {
            id: 1,
            name: 'საავტომობილო'
        }, {
            id: 4,
            name: 'სხვა'
        }
    ];
    $scope.selectedTypeIndex = 0;
    $scope.selectedTransTypeIndex = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        if ($scope.isValid()) {
            app.waybillFilter = {
                transType: $scope.types[$scope.selectedTypeIndex].id,
                transId: $scope.transTypes[$scope.selectedTransTypeIndex].id,
                endAddress: $scope.endAddr,
                driverTin: $scope.driverTin,
                carNumber: $scope.carNumber,
                transTxt: $scope.transTxt
            }

            $scope.cancel();
        }
    }

    $scope.selectType = function (typeIndex) {
        $scope.selectedTypeIndex = typeIndex;

        if (typeIndex === 0) {
            $scope.showTransTxt = false;
            $scope.showDriverTin = false;
            $scope.showCarNumber = false;
            $scope.showEndAddr = false;
            $scope.showTransType = false;
        } else {
            $scope.showTransType = true;
            $scope.selectTransType(0);
        }
    }

    $scope.selectTransType = function (transTypeIndex) {
        $scope.selectedTransTypeIndex = transTypeIndex;

        $scope.showEndAddr = true;
        if (transTypeIndex === 1) {
            $scope.showTransTxt = true;
            $scope.showDriverTin = false;
            $scope.showCarNumber = false;
        } else {
            $scope.showTransTxt = false;
            $scope.showDriverTin = true;
            $scope.showCarNumber = true;            
        }
    }    

    $scope.isValid = function () {
        var result = false;

        if ($scope.types[$scope.selectedTypeIndex].id === 3) {
            result = true;
        } else {
            if ($scope.transTypes[$scope.selectedTransTypeIndex].id === 4) {
                result = !IsUndefinedNullOrEmpty($scope.transTxt);
                if (!result) {
                    $('#txtTransTxt').css('borderColor', '#FF2000');
                } else {
                    $('#txtTransTxt').css('borderColor', '#CCC');
                }

                result = !IsUndefinedNullOrEmpty($scope.endAddr);
                if (!result) {
                    $('#txtEndAddr').css('borderColor', '#FF2000');
                } else {
                    $('#txtEndAddr').css('borderColor', '#CCC');
                }
            } else {
                result = !IsUndefinedNullOrEmpty($scope.transTxt);
                if (!result) {
                    $('#txtTransTxt').css('borderColor', '#FF2000');
                } else {
                    $('#txtTransTxt').css('borderColor', '#CCC');
                }

                result = !IsUndefinedNullOrEmpty($scope.endAddr);
                if (!result) {
                    $('#txtEndAddr').css('borderColor', '#FF2000');
                } else {
                    $('#txtEndAddr').css('borderColor', '#CCC');
                }

                result = !IsUndefinedNullOrEmpty($scope.driverTin);
                if (!result) {
                    $('#txtDriverTin').css('borderColor', '#FF2000');
                } else {
                    $('#txtDriverTin').css('borderColor', '#CCC');
                }

                result = !IsUndefinedNullOrEmpty($scope.carNumber);
                if (!result) {
                    $('#txtCarNumber').css('borderColor', '#FF2000');
                } else {
                    $('#txtCarNumber').css('borderColor', '#CCC');
                }
            }
        }

        return result;
    }
});


app.controller('ProvidedServiceModalController', function ($scope, $modalInstance, $http) {    
    $scope.init = function () {
        $scope.ShowLoader = true;
        $http.post('/Home/GetProducts', { path: EnumProductPaths.Services }).then(function (response) {
            $scope.providedServices = response.data.products;
            $scope.discount = 0;
            $scope.quantity = 1;
            $scope.ShowLoader = false;
        });
    }

    $scope.Validate = function () {
        var result = false;

        result = !IsNullOrEmpty($scope.providedService);

        return result;
    }

    $scope.Save = function () {
        if ($scope.Validate()) {
            app.PushProvidedService($scope.providedService, $scope.discount, $scope.quantity);

            $scope.Cancel();
        }
    }

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.SelectProvidedService = function (providedService) {
        $scope.providedService = providedService;

        angular.forEach($scope.providedServices, function (ps) {
            ps.checked = false;
        });

        providedService.checked = true;
    }
});


app.controller('SerialModalController', function ($scope, $modalInstance) {
    $scope.actionItemName = $modalInstance.actionItemName;

    //$scope.Validate = function () {
    //    var result = false;

    //    result = !IsUndefinedNullOrEmpty($scope.serialNumber);
    //    if (!result) {
    //        $('#txtProductSerial').css('borderColor', '#FF2000');
    //    } else {
    //        $('#txtProductSerial').css('borderColor', '#CCC');
    //    }

    //    return result;
    //}

    $scope.Save = function () {
        app.singleSerial = $scope.serialNumber;

        $scope.Cancel();
    }

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


app.controller('ProductModalController', function ($scope, $modalInstance, $http, $modal) {
    $scope.init = function () {
        $scope.ShowLoader = true;
        $http.get('/Home/GetProducts').then(function (response) {
            $scope.products = response.data.products;
            $scope.discount = 0;
            $scope.ShowLoader = false;
        });
    }

    $scope.saleTypes = $modalInstance.saleTypes;
    $scope.stores = $modalInstance.stores;

    $scope.Validate = function () {
        var result = false;

        result = !IsNullOrEmpty($scope.product);

        return result;
    }

    $scope.Save = function () {
        if ($scope.Validate()) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'ChosenProductModal.html',
                controller: 'ChosenProductModalController',
                size: 'md',
                backdrop: 'static'
            });

            modalInstance.productId = $scope.product.ID;
            modalInstance.productName = $scope.product.Name;
            modalInstance.saleTypes = $scope.saleTypes;
            modalInstance.selectedSaleTypeIndex = 0;
            modalInstance.amount = 1;
            modalInstance.stores = $scope.stores;
            modalInstance.discount = 0;
            modalInstance.currencyType = $scope.product.currencyType;
            modalInstance.unitName = $scope.product.unitName;
            modalInstance.productCode = $scope.product.code;
            modalInstance.product = $scope.product;
            modalInstance.calledFromGR = false;

            $scope.Cancel();
        }
    }

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.SelectProduct = function (product) {
        $scope.product = product;

        angular.forEach($scope.products, function (p) {
            p.checked = false;
        });

        product.checked = true;
    }
});
// ---