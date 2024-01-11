//
import i18n from "i18next";
import i18nBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(i18nBackend)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          // side bar & nav bar
          Users: "Users",
          Countries: "Countries",
          Clients: "Clients",
          Companies: "Companies",
          Logout: "Log Out",
          Welcome: "Welcome",
          Arabic: "Arabic",
          English: "English",
          //buttons inner module
          Branches: "Branches",
          Categories: "Categories",
          Governorate: "Governorate",
          Variants: "Variants",
          // columns title
          Name: "Name",
          Phone: "Phone",
          PhoneCode: "Phone Code",
          Email: "Email",
          Id: "Id",
          Prefix: "Prefix",
          Address: "Address",
          CompanyName: "Company Name",
          ArabicName: "Arabic Name",
          CreatedAt: "Created at",
          BranchName: "Branch Name",
          SearchByName: "Search By Name",
          // modals buttons
          submit: "Submit",
          Save: "Save",
          Close: "Close",
          // client modals
          AddNewClient: "Add New Client",
          AvailableCompaniesCount: "Available Companies Count",
          AvailableEmployeesCount: "Available Employees Count",
          countryId: "country Id",
          GovernorateId: "governorate id",
          EditClient: "Edit Client",
          ClientId: "Client Id",
          // company modals
          AddNewCompany: "Add New Company",
          EditCompany: "Edit Company",
          SearchByCompanyName: "Search By Company Name",
          SelectCLient: " Select CLient",
          // branches modals
          CompanyDetails: "Company Details",
          CompanyId: "Company Id",
          AddNewBranch: "Add New Branch",
          EditBranch: "Edit Branch",
          // categories modal
          AddNewCategory: "Add New Category",
          Category_id: "Category Id",
          EditCategory: "Edit Category",
          AddProducts: "Add Product",
          // countries modals
          AddNewCountry: "Add New Country",
          EditCountry: "Edit Country",
          // governorate
          AddNewGovernorate: " Add New Governorate",
          EditGovernorate: "Edit Governorate",
          SearchByGovernorateName: "Search By Governorate Name",
          SelectCountry: "Select Country",
          // user
          AddNewUser: "Add New User",
          UserType: "User Type",
          EditUser: "Edit User",
          Root: "Root",
          Admin: "Admin",
          All: "All",
          //Variant
          AddNewVariant: "Add New Variant",
          EditVariant: "Edit Variant",
          // variant value
          VariantValue: "Variant Value",
          AddNewVariantValue: "Add New Value",
          VariantId: "Variant Id",
          EditValue: "Edit Value",
          // Products
          Products: "Products",
          AddNewProduct: "Add New Product",
          Details: "Details",
          Description: "Description",
          EditProduct: "Edit Product",
          ///Final Products
          FinalProducts: "Final Products",
          FinalProduct: "Final Product",
          EditFinalProduct: "Edit Final Product",
          // PriceList
          PriceList: "Price List",
          AddNewPriceList: "Add New Price List",
          EditPriceList: "Edit Price List",
          // Contacts
          Contacts: "Contacts",
          AddNewContact: "Add New Contact",
          //WareHouse
          WareHouses: "WareHouses",
          AddNewWareHouse: "Add New WareHouse",
          EditWareHouse: "Edit WareHouse",
          // Final Product Variant Value
          FinalProductVariantValues: "Final Product Variant Values",
          FinalProductId: "Final Product Id",
        },
      },
      ar: {
        translation: {
          // side bar & nav bar
          Users: "المستخدمين",
          Countries: "الدول",
          Clients: "العملاء",
          Companies: "الشركات",
          Logout: "تسجيل خروج",
          Welcome: " مرحبا",
          Arabic: "عربي",
          English: "انجليزي",
          //buttons inner module
          Branches: "الفروع",
          Categories: "الاقسام",
          Governorate: "المحافظات",
          Variants: "الاصناف",

          // columns title
          Product: "المنتجات",
          submit: "موافقة",
          Name: "الاسم",
          Phone: "الهاتف",
          PhoneCode: "رمز الهاتف",
          Email: "البريد الالكتروني",
          Id: "الرقم التعريفي",
          Prefix: "اللقب",
          Address: "العنوان",
          CompanyName: " اسم الشركة",
          ArabicName: "الاسم باللغة العربية",
          CreatedAt: "تم تصميمه في",
          BranchName: "اسم الفرع",
          SearchByName: "البحث بالاسم",
          // modals buttons
          Save: "حفظ",
          Close: "اغلاق",
          // client modals
          AddNewClient: "اضافة عميل جديد",
          AvailableCompaniesCount: "عدد الشركات المتاحة",
          AvailableEmployeesCount: "عدد الموظفين المتاح",
          countryId: "الرقم التعريفي للدولة",
          GovernorateId: "الرقم التعريفي للمحافظة",
          EditClient: "تعديل العميل",
          ClientId: "الرقم التعريفي للعميل",
          // company modals
          AddNewCompany: "اضافة شركة جديدة",
          EditCompany: "تعديل شركة",
          SearchByCompanyName: "البحث بإسم الشركة",
          SelectCLient: "اختر عميل",
          // branches modals
          CompanyDetails: "تفاصيل الشركة",
          CompanyId: "الرقم التعريفي للشركة",
          AddNewBranch: "اضافة فرع جديد",
          EditBranch: "تعديل فرع",
          // categories modal
          AddNewCategory: "اضافة قسم جديد",
          Category_id: "الرقم التعريفي للقسم",
          EditCategory: "تعديل القسم",
          AddProducts: " اضافة منتج",
          // countries modals
          AddNewCountry: "اضافة دولة جديدة",
          EditCountry: "تعديل الدولة",
          // governorate
          AddNewGovernorate: "اضافة محافظة جديدة",
          EditGovernorate: "تعديل محافظة",
          SearchByGovernorateName: "البحث بإسم المحافظة",
          SelectCountry: "اختر دولة",
          // user
          AddNewUser: "اضافة مستخدم جديد",
          UserType: "نوع المستخدم",
          EditUser: "تعديل مستخدم",
          Root: "روت",
          Admin: "ادمن",
          All: "الجميع",
          //Variant
          AddNewVariant: "اضافة صنف جديد",
          EditVariant: " تعديل صنف",
          // variant value
          VariantValue: "قيمة الصنف",
          AddNewVariantValue: " اضافة قيمة جديدة",
          VariantId: "رقم التعريفي للصنف",
          EditValue: "تعديل قيمة",
          // products
          Products: "المنتجات",
          AddNewProduct: "اضافة منتج جديد",
          Details: "التفاصيل",
          Description: "الوصف",
          EditProduct: "تعديل منتج",
          // FinalProducts
          FinalProducts: "المنتجات النهائية",
          FinalProduct: "المنتج النهائي",
          EditFinalProduct: "تعديل المنتج النهائي",
          // PriceList
          PriceList: "قائمة اسعار",
          AddNewPriceList: "اضافة قائمة اسعار جديدة",
          EditPriceList: "تعديل قائمة اسعار",
          // Contacts
          Contacts: "جهات الاتصال",
          AddNewContact: "اضافة جهة اتصال جديدة",
          // WareHouse
          WareHouse: "مخزن",
          AddNewWareHouse: "اضافة مخزن جديد",
          EditWareHouse: "تعديل مخزن ",
          // FinalProductVariantValue
          FinalProductVariantValues: "قيم الاصناف في المنتج النهائي",
          FinalProductId:"الرقم االتعريفي للمنتج النهائي",
        },
      },
    },
  });

export default i18n;
