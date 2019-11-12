declare type VueComponent = any;
/**
 * Jenerik obje türü, sadece tek tipte veri tutan esnek objeleri tanımlamak için kullanılır
 * @template T saklanacak veri türüdür
 */
declare type GenericObject<T> = {[key: string] : T};
//declare type SensitiveGenericObject<T> = {[key: string] : T};
declare class Vue 
{ 
    /**
     * Vue Uygulamasını oluşturur ve başlatır
     * @param data Gerekli parametreleri bu data parametresi üzerinden obje olarak almaktadır. 
     */
    public constructor(data: { 
        /**
         * Hangi element içerisinde işlemler yapılacağı tutulur. Bu element, 
         * seçici olarak verilen string ile bulunur. Örn: "#el", id'si "el" olan bir elemanı seçer.
         */
        el : string, 
        
        data? : GenericObject<any>
    });
    /**
     * Tekrar tekrar kullanılabilen arayüz bileşeninin oluşturucu fonksiyonudur.
     */
    static component: (tagName : string, data: {
        /**
         * HTML iskeletini, Vue'nin kendi tanımlamaları ile birlikte string olarak tutan parametredir. 
         */
        template?: string;

        /**
         * Başlatılırken gerekli verileri hazırlayarak tüm objeleri bir obje içerisinde döndüren fonksiyondur.
         * Bu fonksiyon içerisinde oluşturulan objedeki veriler, Vue Şablonu(Template) içerisinde kullanılabilmektedir.
         * 
         */
        data?: () => GenericObject<any>;
        /**
         * Vue Component içerisinde tanımlanmış fonksiyonları saklayan objedir
         */
        methods?: GenericObject<Function>;

        /** Satır üzerinden tanımlı obje attribute'ları props üzerinden belirlenmektedir */
        props? : GenericObject<any>;
        /**
         * data'da ya da props'ta tanımlanmış değişkenleri/verilerin 
         * değişimlerinde tetiklenen fonksiyonları barındırır
         */
        watch? : GenericObject<Function>;
        /**
         * Eğer ihtiyaç halinde notasyonu artırmak için içerisinde kullanılan Vue Bileşenlerinin oluşturulmuş hali tutulabilir.
         */
        components?: GenericObject<any>;
        /**
         * Önceden tanımlanmak yerine tanımlı verilerin hesaplanarak saklanması üzere fonksiyon halindeki değişkenlerdir.
         */
        computed? : GenericObject<(newValue : GenericObject<any>, oldValue : GenericObject<any>) => void>
        /**
         * Component hazır iken / güncellendiğinde tetiklenen fonksiyondur
         */
        mounted? : Function;
        /** Vue componenti yaratıldığında tetiklenir */
        created? : Function;
    }) => void;
    static set: (list, key, value) => void;
}
// export interface VueComponent
// {
//     $refs : any;
// }
// export class Vue
// {
//     $refs: any;
//     public constructor(data : Object);
//     public static component(tagname : string, dataDecleration : {}) : VueComponent;
//     public static set(object : Array<any> | Object,key:string,value:string);
// }
