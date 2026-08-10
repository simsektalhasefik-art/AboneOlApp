import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet, Text as RNText, View, ScrollView, TouchableOpacity, TextInput,
  Modal, SafeAreaView, StatusBar, useWindowDimensions, Linking, Platform, Pressable
} from 'react-native';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { app } from './src/firebase';
import Svg, { Path, Circle } from 'react-native-svg';

const auth = getAuth(app);
auth.languageCode = 'tr';
const db = getFirestore(app);
const LanguageContext = createContext('tr');

// Arayüzdeki sabit metinleri tek merkezden TR / EN olarak sunar
// Kullanıcı tarafından girilen abonelik adları ve özel veriler çevrilmez
const translations = {
  tr: {
    ui: {
      'Yükleniyor...': 'Yükleniyor...',
      'Akıllı Abonelik Ve Bütçe Asistanı': 'Akıllı Abonelik Ve Bütçe Asistanı',
      'Giriş Yap': 'Giriş Yap',
      'Kayıt Ol': 'Kayıt Ol',
      'Ad Soyad / Kullanıcı Adı': 'Ad Soyad / Kullanıcı Adı',
      'Ad Soyad veya Kullanıcı Adı': 'Ad Soyad veya Kullanıcı Adı',
      'E-posta / Kullanıcı Adı': 'E-posta / Kullanıcı Adı',
      'E-posta': 'E-posta',
      'E-posta Adresi': 'E-posta Adresi',
      'Şifre': 'Şifre',
      'Şifre Tekrarı': 'Şifre Tekrarı',
      'Şifremi Unuttum?': 'Şifremi Unuttum?',
      'veya': 'veya',
      'Google İle Devam Et': 'Google İle Devam Et',
      'Hesabın Yok Mu? Kayıt Ol': 'Hesabın Yok Mu? Kayıt Ol',
      'Zaten Hesabın Var Mı? Giriş Yap': 'Zaten Hesabın Var Mı? Giriş Yap',
      'Beni Hatırla': 'Beni Hatırla',
      'Şifremi Unuttum': 'Şifremi Unuttum',
      'Sıfırlama Bağlantısı Gönder': 'Sıfırlama Bağlantısı Gönder',
      'Gönderiliyor...': 'Gönderiliyor...',
      'Vazgeç': 'Vazgeç',
      'Tamam': 'Tamam',
      'İptal': 'İptal',
      'E-posta Gönderildi': 'E-posta Gönderildi',
      'Kayıt Başarıyla Gerçekleşti': 'Kayıt Başarıyla Gerçekleşti',
      'Eksik veya Hatalı Bilgi': 'Eksik veya Hatalı Bilgi',
      'Şifreniz Başarıyla Güncellendi': 'Şifreniz Başarıyla Güncellendi',
      'Abonelikler': 'Abonelikler',
      'Takvim': 'Takvim',
      'Ödeme Takvimi': 'Ödeme Takvimi',
      'Analiz ve Raporlar': 'Analiz ve Raporlar',
      'Kullanıcı Ayarları': 'Kullanıcı Ayarları',
      'CSV Excel İndir': 'CSV Excel İndir',
      '+ Yeni Abonelik Ekle': '+ Yeni Abonelik Ekle',
      '+ Abonelik Ekle': '+ Abonelik Ekle',
      '+ Ekle': '+ Ekle',
      'Çıkış Yap': 'Çıkış Yap',
      'Oturumu Kapat': 'Oturumu Kapat',
      'Aboneliklerinizi Ve Düzenli Ödemelerinizi Yönetin': 'Aboneliklerinizi Ve Düzenli Ödemelerinizi Yönetin',
      'Yaklaşan Ödeme Tarihlerini Takvim Üzerinden Takip Edin': 'Yaklaşan Ödeme Tarihlerini Takvim Üzerinden Takip Edin',
      'Aylık Ortalama Maliyet Eğilimlerinizi Ve Bütçe Yükünüzü İnceleyin': 'Aylık Ortalama Maliyet Eğilimlerinizi ve Bütçe Yükünüzü İnceleyin',
      'Görünüm Filtresi': 'Görünüm Filtresi',
      'Abonelik Listenizi Tek Dokunuşla Daraltın': 'Abonelik Listenizi Tek Dokunuşla Daraltın',
      'Tüm Abonelikler': 'Tüm Abonelikler',
      'Aylık Ödemeler': 'Aylık Ödemeler',
      'Yıllık Ödemeler': 'Yıllık Ödemeler',
      'Yaklaşan Ödemeler': 'Yaklaşan Ödemeler',
      'En Yüksek Tutar': 'En Yüksek Tutar',
      'Ada Göre': 'Ada Göre',
      'Kayıt Bulunamadı': 'Kayıt Bulunamadı',
      'Arama Metnini Veya Görünüm Filtresini Değiştiriniz': 'Arama Metnini Veya Görünüm Filtresini Değiştiriniz',
      'Abonelik, Kategori veya Ödeme Yöntemi Ara...': 'Abonelik, Kategori veya Ödeme Yöntemi Ara...',
      'Günlük Maliyet': 'Günlük Maliyet',
      'Bütçe Yılı': 'Bütçe Yılı',
      'Ödendi': 'Ödendi',
      'Ödendi İşaretle': 'Ödendi İşaretle',
      'Düzenle': 'Düzenle',
      'Kredi': 'Kredi',
      'Eğlence': 'Eğlence',
      'Yazılım & AI': 'Yazılım & AI',
      'Müzik': 'Müzik',
      'Eğitim': 'Eğitim',
      'Bulut & Depolama': 'Bulut & Depolama',
      'Spor & Sağlık': 'Spor & Sağlık',
      'Diğer': 'Diğer',
      'Bildirim Yok': 'Bildirim Yok',
      'Aynı Gün': 'Aynı Gün',
      '1 Gün Önce': '1 Gün Önce',
      '2 Gün Önce': '2 Gün Önce',
      '3 Gün Önce': '3 Gün Önce',
      '1 Hafta Önce': '1 Hafta Önce',
      'Sabit Abonelikler': 'Sabit Abonelikler',
      'Toplam Finansal Yük': 'Toplam Finansal Yük',
      'Sabit Abonelik Aylık Ortalama Maliyeti': 'Sabit Abonelik Aylık Ortalama Maliyeti',
      'Aylık Ortalama Maliyet Grafiği': 'Aylık Ortalama Maliyet Grafiği',
      'Akıllı Asistan Özeti': 'Akıllı Asistan Özeti',
      'Ödeme Yöntemine Göre Aylık Dağılım': 'Ödeme Yöntemine Göre Aylık Dağılım',
      'Kategori Bazlı Aylık Dağılım': 'Kategori Bazlı Aylık Dağılım',
      'Toplam / Ay': 'Toplam / Ay',
      'Yeni Abonelik Ekle': 'Yeni Abonelik Ekle',
      'Hızlı Şablon Seç': 'Hızlı Şablon Seç',
      '+ Şablon Ekle': '+ Şablon Ekle',
      'Temel Bilgiler': 'Temel Bilgiler',
      'Servis / Abonelik Adı': 'Servis / Abonelik Adı',
      'Tutar / Fiyat': 'Tutar / Fiyat',
      'Para Birimi': 'Para Birimi',
      'Ödeme Periyodu': 'Ödeme Periyodu',
      'Aylık': 'Aylık',
      'Yıllık': 'Yıllık',
      'Yıllık Tahmini Artış / Zam Oranı (%)': 'Yıllık Tahmini Artış / Zam Oranı (%)',
      'Zam Uygulama Periyodu': 'Zam Uygulama Periyodu',
      'Ödeme Yapılan Kart / Hesap': 'Ödeme Yapılan Kart / Hesap',
      '+ Yöntem Ekle': '+ Yöntem Ekle',
      'Kategori': 'Kategori',
      'Ödeme Tarihi': 'Ödeme Tarihi',
      'Gün': 'Gün',
      'Ay': 'Ay',
      'Yıl': 'Yıl',
      'Hatırlatıcı Kuralı': 'Hatırlatıcı Kuralı',
      'Bildirim Kanalı': 'Bildirim Kanalı',
      'Tarayıcı Bildirimi': 'Tarayıcı Bildirimi',
      'İptal / Yönetim Bağlantısı': 'İptal / Yönetim Bağlantısı',
      'İleri →': 'İleri →',
      '← Geri': '← Geri',
      'Kaydet': 'Kaydet',
      'Kapat': 'Kapat',
      'Şifremi Değiştir': 'Şifremi Değiştir',
      'Mevcut Şifre': 'Mevcut Şifre',
      'Yeni Şifre': 'Yeni Şifre',
      'Yeni Şifre Tekrarı': 'Yeni Şifre Tekrarı',
      'Şifreyi Güncelle': 'Şifreyi Güncelle',
      'Görünüm Ayarları': 'Görünüm Ayarları',
      'Tema': 'Tema',
      'Yazı Boyutu': 'Yazı Boyutu',
      'Küçük': 'Küçük',
      'Normal': 'Normal',
      'Büyük': 'Büyük',
      'Çok Büyük': 'Çok Büyük',
      'Açık Füme': 'Açık Füme',
      'Antrasit': 'Antrasit',
      'Lacivert': 'Lacivert',
      'Adaçayı': 'Adaçayı',
      'Açık Yeşil': 'Açık Yeşil',
      'Kayısı': 'Kayısı',
      'Kum': 'Kum',
      'Lavanta': 'Lavanta',
      'Gül Kurusu': 'Gül Kurusu',
      'Açık': 'Açık',
      'Ocak': 'Ocak',
      'Temmuz': 'Temmuz',
      'Bugün': 'Bugün',
      'Aboneliği Sil': 'Aboneliği Sil',
      'Şablonu Sil': 'Şablonu Sil',
      'Ödeme Yöntemini Sil': 'Ödeme Yöntemini Sil',
      'Geri Yükle': 'Geri Yükle',
      'Yedeği Geri Yükle': 'Yedeği Geri Yükle',
      'Abonelik Veya Sabit Gider Bilgilerini Girin': 'Abonelik Veya Sabit Gider Bilgilerini Girin',
      'Abonelik Yıl Dönümünde': 'Abonelik Yıl Dönümünde',
      'Aboneliğin Tahsil Edildiği Yöntemi Seçin': 'Aboneliğin Tahsil Edildiği Yöntemi Seçin',
      'Aktif Bir Abonelik Eklediğinizde Aylık Dağılım Burada Görünür': 'Aktif Bir Abonelik Eklediğinizde Aylık Dağılım Burada Görünür',
      'Ana Panel Bütçe Yılı': 'Ana Panel Bütçe Yılı',
      'Arka Plan Teması': 'Arka Plan Teması',
      'Arka Plan Temasını Ve Yazı Boyutunu Kişiselleştirin': 'Arka Plan Temasını Ve Yazı Boyutunu Kişiselleştirin',
      'Artışın Abonelik Yıl Dönümünde Veya Her Takvim Yılı Başında Devreye Girmesini Seçin': 'Artışın Abonelik Yıl Dönümünde Veya Her Takvim Yılı Başında Devreye Girmesini Seçin',
      'Ayarları Uygula': 'Ayarları Uygula',
      'Aylık Bütçe Dağılımı': 'Aylık Bütçe Dağılımı',
      'Aylık Toplam': 'Aylık Toplam',
      'Aylık Ödeme Yükü Bulunamadı': 'Aylık Ödeme Yükü Bulunamadı',
      'Başlangıç / İlk Taksit Tarihi': 'Başlangıç / İlk Taksit Tarihi',
      'Başlangıç Ayı Geldiğinde Zam Uygulanır': 'Başlangıç Ayı Geldiğinde Zam Uygulanır',
      'Bildirim E-posta Adresi': 'Bildirim E-posta Adresi',
      'Bitiş Tarihini Görmek İçin Vade İle Başlangıç Ayı/Yılını Girin': 'Bitiş Tarihini Görmek İçin Vade İle Başlangıç Ayı/Yılını Girin',
      'Bu Abonelik Zaten Kayıtlı': 'Bu Abonelik Zaten Kayıtlı',
      'Bu Gün İçin Ödeme Yok': 'Bu Gün İçin Ödeme Yok',
      'Bu Güne Ait Ödemeler': 'Bu Güne Ait Ödemeler',
      'E-Postadaki Bağlantı Üzerinden Yeni Şifrenizi Belirleyebilirsiniz Cebin PRO Mevcut Şifrenizi Görüntülemez Veya E-Posta İle Göndermez': 'E-Postadaki Bağlantı Üzerinden Yeni Şifrenizi Belirleyebilirsiniz Cebin PRO Mevcut Şifrenizi Görüntülemez Veya E-Posta İle Göndermez',
      'Finansal Analizlerin Gösterileceği Yılı Seçin': 'Finansal Analizlerin Gösterileceği Yılı Seçin',
      'Güvenlik Nedeniyle Önce Mevcut Şifreniz Doğrulanır': 'Güvenlik Nedeniyle Önce Mevcut Şifreniz Doğrulanır',
      'Hatırlatıcı E-Postaları Bu Adrese Yönlendirilecektir': 'Hatırlatıcı E-Postaları Bu Adrese Yönlendirilecektir',
      'Hazır Bir Servis Seçerek Alanları Otomatik Doldurun': 'Hazır Bir Servis Seçerek Alanları Otomatik Doldurun',
      'Her 1 Ocak Tarihinde Zam Uygulanır': 'Her 1 Ocak Tarihinde Zam Uygulanır',
      'Hesabınıza Bağlı E-Posta Adresini Girin Şifrenizi Güvenli Şekilde Yenileyebilmeniz İçin Firebase Tarafından Bir Sıfırlama Bağlantısı Gönderilecektir': 'Hesabınıza Bağlı E-Posta Adresini Girin Şifrenizi Güvenli Şekilde Yenileyebilmeniz İçin Firebase Tarafından Bir Sıfırlama Bağlantısı Gönderilecektir',
      'Hesap Bilgileri': 'Hesap Bilgileri',
      'Hesap Bilgilerinizi Görüntüleyin Ve Şifrenizi Güvenli Şekilde Güncelleyin': 'Hesap Bilgilerinizi Görüntüleyin Ve Şifrenizi Güvenli Şekilde Güncelleyin',
      'Kart Ve Hesap Bazında Aylık Ödeme Yükü': 'Kart Ve Hesap Bazında Aylık Ödeme Yükü',
      'Kredi / Taksit Planı': 'Kredi / Taksit Planı',
      'Kullanıcı Adı': 'Kullanıcı Adı',
      'Mevcut Kaydı Düzenleyebilir Veya Aboneliği Farklı Bir Adla Ekleyebilirsiniz': 'Mevcut Kaydı Düzenleyebilir Veya Aboneliği Farklı Bir Adla Ekleyebilirsiniz',
      'Raporlama Dönemi': 'Raporlama Dönemi',
      'Raporlama Yılı': 'Raporlama Yılı',
      'Seçilen Oran, Gelecek Yıllardaki Maliyet Ve Bütçe Projeksiyonlarına Bileşik Olarak Yansıtılır': 'Seçilen Oran, Gelecek Yıllardaki Maliyet Ve Bütçe Projeksiyonlarına Bileşik Olarak Yansıtılır',
      'Seçilen Yıl İçin Kategori Verisi Bulunamadı': 'Seçilen Yıl İçin Kategori Verisi Bulunamadı',
      'Sonraki ▶': 'Sonraki ▶',
      'Tahmini Son Taksit': 'Tahmini Son Taksit',
      'Takvim Yılı': 'Takvim Yılı',
      'Takvim Yılı Başında (Ocak)': 'Takvim Yılı Başında (Ocak)',
      'Tarayıcı Bildirimlerinin Çalışması İçin Cihazınızda Ve Tarayıcınızda Bildirim İzninin Açık Olması Gerekir İzin Sorulduğunda “İzin Ver” Seçeneğini Kullanın': 'Tarayıcı Bildirimlerinin Çalışması İçin Cihazınızda Ve Tarayıcınızda Bildirim İzninin Açık Olması Gerekir İzin Sorulduğunda “İzin Ver” Seçeneğini Kullanın',
      'Toplam': 'Toplam',
      'Toplam Taksit Sayısı (Vade)': 'Toplam Taksit Sayısı (Vade)',
      'Tüm Analizler Seçilen Yıla Göre Güncellenir': 'Tüm Analizler Seçilen Yıla Göre Güncellenir',
      'Vade Ve İlk Taksit Ayını Girin Kayıt, Son Taksit Ayından Sonra Takvim Ve Raporlarda Otomatik Olarak Sona Erer': 'Vade Ve İlk Taksit Ayını Girin Kayıt, Son Taksit Ayından Sonra Takvim Ve Raporlarda Otomatik Olarak Sona Erer',
      'Yönet': 'Yönet',
      'Ödeme Takviminde Görüntülenecek Yılı Seçin': 'Ödeme Takviminde Görüntülenecek Yılı Seçin',
      'Özet Maliyetlerin Hesaplanacağı Projeksiyon Yılını Seçin': 'Özet Maliyetlerin Hesaplanacağı Projeksiyon Yılını Seçin',
      'Şablonu Kaydet': 'Şablonu Kaydet',
      '◀ Önceki': '◀ Önceki',
      '📧 E-posta': '📧 E-posta',
      '🌐 Tarayıcı Bildirimi': '🌐 Tarayıcı Bildirimi',
      '📄 CSV Excel İndir': '📄 CSV Excel İndir',
      '🚪 Çıkış Yap': '🚪 Çıkış Yap',
      'Lütfen Ad Soyad veya Kullanıcı Adınızı Giriniz.': 'Lütfen Ad Soyad veya Kullanıcı Adınızı Giriniz.',
      'Lütfen E-posta Adresinizi Giriniz.': 'Lütfen E-posta Adresinizi Giriniz.',
      'Lütfen E-posta veya Kullanıcı Adınızı ve Şifrenizi Giriniz.': 'Lütfen E-posta veya Kullanıcı Adınızı ve Şifrenizi Giriniz.',
      'Lütfen Geçerli Bir E-posta Adresi Giriniz.': 'Lütfen Geçerli Bir E-posta Adresi Giriniz.',
      'Lütfen Tüm Zorunlu Alanları Doldurunuz.': 'Lütfen Tüm Zorunlu Alanları Doldurunuz.',
      'Lütfen Şifrenizi Tekrar Giriniz.': 'Lütfen Şifrenizi Tekrar Giriniz.',
      'Şifre En Az 6 Karakter Olmalıdır.': 'Şifre En Az 6 Karakter Olmalıdır.',
      'Şifre ve Şifre Tekrarı Uyuşmuyor. Lütfen Bilgilerinizi Kontrol Ediniz.': 'Şifre ve Şifre Tekrarı Uyuşmuyor. Lütfen Bilgilerinizi Kontrol Ediniz.',
      'Kullanıcı Adı veya E-posta Bulunamadı.': 'Kullanıcı Adı veya E-posta Bulunamadı.',
      'Bu Kullanıcı Adıyla Hesap Mevcut': 'Bu Kullanıcı Adıyla Hesap Mevcut',
      'Bu E-posta Adresi Zaten Kullanılıyor.': 'Bu E-posta Adresi Zaten Kullanılıyor.',
      'Geçersiz E-posta Adresi.': 'Geçersiz E-posta Adresi.',
      'Şifre Hatalı. Lütfen Tekrar Deneyiniz.': 'Şifre Hatalı. Lütfen Tekrar Deneyiniz.',
      'E-posta/Kullanıcı Adı veya Şifre Hatalı.': 'E-posta/Kullanıcı Adı veya Şifre Hatalı.',
      'Çok Fazla Deneme Yapıldı. Lütfen Bir Süre Sonra Tekrar Deneyiniz.': 'Çok Fazla Deneme Yapıldı. Lütfen Bir Süre Sonra Tekrar Deneyiniz.',
      'Ağ Bağlantısı Hatası. İnternet Bağlantınızı Kontrol Ediniz.': 'Ağ Bağlantısı Hatası. İnternet Bağlantınızı Kontrol Ediniz.',
      'Bir Hata Oluştu. Lütfen Tekrar Deneyiniz.': 'Bir Hata Oluştu. Lütfen Tekrar Deneyiniz.',
      'Bu E-posta Adresiyle Kayıtlı Bir Hesap Bulunamadı.': 'Bu E-posta Adresiyle Kayıtlı Bir Hesap Bulunamadı.',
      'Şifre Sıfırlama E-postası Gönderilemedi. Lütfen Tekrar Deneyiniz.': 'Şifre Sıfırlama E-postası Gönderilemedi. Lütfen Tekrar Deneyiniz.',
      'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.': 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
      'Oturumu Kapatmak İstediğinize Emin Misiniz?': 'Oturumu Kapatmak İstediğinize Emin Misiniz?',
      'Mevcut şifrenizi giriniz.': 'Mevcut şifrenizi giriniz.',
      'Yeni şifrenizi giriniz.': 'Yeni şifrenizi giriniz.',
      'Yeni şifre en az 6 karakter olmalıdır.': 'Yeni şifre en az 6 karakter olmalıdır.',
      'Yeni şifrenizi tekrar giriniz.': 'Yeni şifrenizi tekrar giriniz.',
      'Şifreler uyuşmuyor.': 'Şifreler uyuşmuyor.',
      'Eski şifre yanlış.': 'Eski şifre yanlış.',
      'Oturum bilgileri bulunamadı. Lütfen yeniden giriş yapınız.': 'Oturum bilgileri bulunamadı. Lütfen yeniden giriş yapınız.',
      'Google İle Giriş İçin OAuth Entegrasyonu Yapılandırılmalıdır.': 'Google İle Giriş İçin OAuth Entegrasyonu Yapılandırılmalıdır.',
      'Toplam Finansal Yük: Abonelikler Ve Aktif Kredi Taksitleri Birlikte Gösterilir': 'Toplam Finansal Yük: Abonelikler Ve Aktif Kredi Taksitleri Birlikte Gösterilir',
      'Sabit Abonelikler: Kredi Taksitleri Ölçekten Ayrılarak Küçük Giderler Daha Net Görünür': 'Sabit Abonelikler: Kredi Taksitleri Ölçekten Ayrılarak Küçük Giderler Daha Net Görünür',
      'Detay İçin Bir Aya Dokunun Grafiği Yatay Kaydırabilirsiniz': 'Detay İçin Bir Aya Dokunun Grafiği Yatay Kaydırabilirsiniz',
      'Detay İçin Çubukların Üzerine Gelin Veya Tıklayın': 'Detay İçin Çubukların Üzerine Gelin Veya Tıklayın',
      'Aylık Ortalama Maliyet': 'Aylık Ortalama Maliyet',
      'Henüz Analiz Oluşturmak İçin Yeterli Maliyet Verisi Bulunmuyor.': 'Henüz Analiz Oluşturmak İçin Yeterli Maliyet Verisi Bulunmuyor.',
      'Lütfen Abonelik veya Gider Adını Giriniz.': 'Lütfen Abonelik veya Gider Adını Giriniz.',
      'Lütfen sıfırdan büyük geçerli bir tutar giriniz.': 'Lütfen sıfırdan büyük geçerli bir tutar giriniz.',
      'Ay değeri 1 ile 12 arasında olmalıdır.': 'Ay değeri 1 ile 12 arasında olmalıdır.',
      'Lütfen geçerli bir yıl seçiniz.': 'Lütfen geçerli bir yıl seçiniz.',
      'Yıllık artış oranı 0 ile 100 arasında olmalıdır.': 'Yıllık artış oranı 0 ile 100 arasında olmalıdır.',
      'Lütfen bir ödeme yöntemi seçiniz.': 'Lütfen bir ödeme yöntemi seçiniz.',
      'Lütfen bildirimlerin gönderileceği e-posta adresini giriniz.': 'Lütfen bildirimlerin gönderileceği e-posta adresini giriniz.',
      'Lütfen geçerli bir bildirim e-posta adresi giriniz.': 'Lütfen geçerli bir bildirim e-posta adresi giriniz.',
      'Yönetim bağlantısı http:// veya https:// ile başlamalıdır.': 'Yönetim bağlantısı http:// veya https:// ile başlamalıdır.',
      'Toplam taksit sayısı 1 ile 600 arasında olmalıdır.': 'Toplam taksit sayısı 1 ile 600 arasında olmalıdır.',
      'İlk taksit ayı 1 ile 12 arasında olmalıdır.': 'İlk taksit ayı 1 ile 12 arasında olmalıdır.',
      'İlk taksit yılı 2025 ile 2100 arasında olmalıdır.': 'İlk taksit yılı 2025 ile 2100 arasında olmalıdır.',
      'Lütfen şablon adını giriniz.': 'Lütfen şablon adını giriniz.',
      'Lütfen sıfırdan büyük geçerli bir şablon fiyatı giriniz.': 'Lütfen sıfırdan büyük geçerli bir şablon fiyatı giriniz.',
      'Bu isimde bir şablon zaten bulunuyor.': 'Bu isimde bir şablon zaten bulunuyor.',
      'Lütfen ödeme yöntemi adını giriniz.': 'Lütfen ödeme yöntemi adını giriniz.',
      'Bu ödeme yöntemi zaten bulunuyor.': 'Bu ödeme yöntemi zaten bulunuyor.',
      'Dışa aktarılacak kayıt bulunmuyor.': 'Dışa aktarılacak kayıt bulunmuyor.',
      'Abonelik listesi bulunamadı.': 'Abonelik listesi bulunamadı.',
      'Yedek başarıyla geri yüklendi.': 'Yedek başarıyla geri yüklendi.',
      'Abonelik Düzenle': 'Abonelik Düzenle',
      'Şablon Adı': 'Şablon Adı',
      'Örn: Netflix, Ev Kirası': 'Örn: Netflix, Ev Kirası',
      'Örn: Akbank Axess': 'Örn: Akbank Axess',
      'Kredi Kayıtlarında Gün Alanı Taksit Gününü Belirler; Taksit Başlangıç Ayı Ve Yılı Yukarıdaki Kredi / Taksit Planı Alanından Alınır': 'Kredi Kayıtlarında Gün Alanı Taksit Gününü Belirler; Taksit Başlangıç Ayı Ve Yılı Yukarıdaki Kredi / Taksit Planı Alanından Alınır',
      'Aylık Ödemelerde Başlangıç Ayı, Yıllık Ödemelerde Tahsilat Ayı Olarak Kullanılır': 'Aylık Ödemelerde Başlangıç Ayı, Yıllık Ödemelerde Tahsilat Ayı Olarak Kullanılır',
      'Çıkış': 'Çıkış',
      'Mevcut Şifreniz': 'Mevcut Şifreniz',
      'Yeni Şifreyi Tekrar Giriniz': 'Yeni Şifreyi Tekrar Giriniz',
      'Güncelleniyor...': 'Güncelleniyor...',
      'Taksit': 'Taksit',
      'Bitiş': 'Bitiş',
      'Kayıt': 'Kayıt',
      'Kayıtlar': 'Kayıtlar',
      'Adım': 'Adım',
      'Aylık Vade Tamamlandığında Bu Kalem Rapor Ve Takvim Hesaplamalarından Otomatik Olarak Çıkar': 'Aylık Vade Tamamlandığında Bu Kalem Rapor Ve Takvim Hesaplamalarından Otomatik Olarak Çıkar',
      'İsimli Abonelik Zaten Listenizde Bulunuyor': 'İsimli Abonelik Zaten Listenizde Bulunuyor',
      'Geçen Aya Göre': 'Geçen Aya Göre',
      'Yıllık Toplam Maliyet': 'Yıllık Toplam Maliyet',
      'kayıt': 'kayıt',
      'Yıllık Artış': 'Yıllık Artış',
      'Taksit · Bitiş': 'Taksit · Bitiş',
      'Aylık Vade Tamamlandığında Bu Kalem Rapor Ve Takvim Hesaplamalarından Otomatik Çıkarılır': 'Aylık Vade Tamamlandığında Bu Kalem Rapor Ve Takvim Hesaplamalarından Otomatik Çıkarılır',
    },
    calendar: {
      months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
      weekdaysShort: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    },
    periods: { month: 'ay', year: 'yıl' }
  },
  en: {
    ui: {
  'Yükleniyor...': 'Loading...',
  'Akıllı Abonelik Ve Bütçe Asistanı': 'Smart Subscription And Budget Assistant',
  'Giriş Yap': 'Sign In',
  'Kayıt Ol': 'Sign Up',
  'Ad Soyad / Kullanıcı Adı': 'Full Name / Username',
  'Ad Soyad veya Kullanıcı Adı': 'Full Name or Username',
  'E-posta / Kullanıcı Adı': 'Email / Username',
  'E-posta': 'Email',
  'E-posta Adresi': 'Email Address',
  'Şifre': 'Password',
  'Şifre Tekrarı': 'Confirm Password',
  'Şifremi Unuttum?': 'Forgot Password?',
  'veya': 'or',
  'Google İle Devam Et': 'Continue With Google',
  'Hesabın Yok Mu? Kayıt Ol': 'No Account? Sign Up',
  'Zaten Hesabın Var Mı? Giriş Yap': 'Already Have An Account? Sign In',
  'Beni Hatırla': 'Remember Me',
  'Şifremi Unuttum': 'Forgot Password',
  'Sıfırlama Bağlantısı Gönder': 'Send Reset Link',
  'Gönderiliyor...': 'Sending...',
  'Vazgeç': 'Cancel',
  'Tamam': 'OK',
  'İptal': 'Cancel',
  'E-posta Gönderildi': 'Email Sent',
  'Kayıt Başarıyla Gerçekleşti': 'Registration Completed Successfully',
  'Eksik veya Hatalı Bilgi': 'Missing Or Invalid Information',
  'Şifreniz Başarıyla Güncellendi': 'Password Updated Successfully',
  'Abonelikler': 'Subscriptions',
  'Takvim': 'Calendar',
  'Ödeme Takvimi': 'Payment Calendar',
  'Analiz ve Raporlar': 'Analytics And Reports',
  'Kullanıcı Ayarları': 'User Settings',
  'CSV Excel İndir': 'Download CSV Excel',
  '+ Yeni Abonelik Ekle': '+ Add New Subscription',
  '+ Abonelik Ekle': '+ Add Subscription',
  '+ Ekle': '+ Add',
  'Çıkış Yap': 'Sign Out',
  'Oturumu Kapat': 'Sign Out',
  'Aboneliklerinizi Ve Düzenli Ödemelerinizi Yönetin': 'Manage Your Subscriptions And Recurring Payments',
  'Yaklaşan Ödeme Tarihlerini Takvim Üzerinden Takip Edin': 'Track Upcoming Payment Dates On The Calendar',
  'Aylık Ortalama Maliyet Eğilimlerinizi Ve Bütçe Yükünüzü İnceleyin': 'Review Monthly Average Cost Trends And Your Budget Load',
  'Görünüm Filtresi': 'View Filter',
  'Abonelik Listenizi Tek Dokunuşla Daraltın': 'Narrow Your Subscription List With One Tap',
  'Tüm Abonelikler': 'All Subscriptions',
  'Aylık Ödemeler': 'Monthly Payments',
  'Yıllık Ödemeler': 'Yearly Payments',
  'Yaklaşan Ödemeler': 'Upcoming Payments',
  'En Yüksek Tutar': 'Highest Amount',
  'Ada Göre': 'By Name',
  'Kayıt Bulunamadı': 'No Records Found',
  'Arama Metnini Veya Görünüm Filtresini Değiştiriniz': 'Change The Search Text Or View Filter',
  'Abonelik, Kategori veya Ödeme Yöntemi Ara...': 'Search Subscription, Category Or Payment Method...',
  'Günlük Maliyet': 'Daily Cost',
  'Bütçe Yılı': 'Budget Year',
  'Ödendi': 'Paid',
  'Ödendi İşaretle': 'Mark As Paid',
  'Düzenle': 'Edit',
  'Kredi': 'Credit',
  'Eğlence': 'Entertainment',
  'Yazılım & AI': 'Software & AI',
  'Müzik': 'Music',
  'Eğitim': 'Education',
  'Bulut & Depolama': 'Cloud & Storage',
  'Spor & Sağlık': 'Sports & Health',
  'Diğer': 'Other',
  'Bildirim Yok': 'No Notification',
  'Aynı Gün': 'Same Day',
  '1 Gün Önce': '1 Day Before',
  '2 Gün Önce': '2 Days Before',
  '3 Gün Önce': '3 Days Before',
  '1 Hafta Önce': '1 Week Before',
  'Sabit Abonelikler': 'Fixed Subscriptions',
  'Toplam Finansal Yük': 'Total Financial Load',
  'Sabit Abonelik Aylık Ortalama Maliyeti': 'Fixed Subscription Monthly Average Cost',
  'Aylık Ortalama Maliyet Grafiği': 'Monthly Average Cost Chart',
  'Akıllı Asistan Özeti': 'Smart Assistant Summary',
  'Ödeme Yöntemine Göre Aylık Dağılım': 'Monthly Distribution By Payment Method',
  'Kategori Bazlı Aylık Dağılım': 'Monthly Distribution By Category',
  'Toplam / Ay': 'Total / Month',
  'Yeni Abonelik Ekle': 'Add New Subscription',
  'Hızlı Şablon Seç': 'Choose Quick Template',
  '+ Şablon Ekle': '+ Add Template',
  'Temel Bilgiler': 'Basic Information',
  'Servis / Abonelik Adı': 'Service / Subscription Name',
  'Tutar / Fiyat': 'Amount / Price',
  'Para Birimi': 'Currency',
  'Ödeme Periyodu': 'Payment Period',
  'Aylık': 'Monthly',
  'Yıllık': 'Yearly',
  'Yıllık Tahmini Artış / Zam Oranı (%)': 'Estimated Annual Increase / Raise Rate (%)',
  'Zam Uygulama Periyodu': 'Increase Application Period',
  'Ödeme Yapılan Kart / Hesap': 'Payment Card / Account',
  '+ Yöntem Ekle': '+ Add Method',
  'Kategori': 'Category',
  'Ödeme Tarihi': 'Payment Date',
  'Gün': 'Day',
  'Ay': 'Month',
  'Yıl': 'Year',
  'Hatırlatıcı Kuralı': 'Reminder Rule',
  'Bildirim Kanalı': 'Notification Channel',
  'Tarayıcı Bildirimi': 'Browser Notification',
  'İptal / Yönetim Bağlantısı': 'Cancel / Management Link',
  'İleri →': 'Next →',
  '← Geri': '← Back',
  'Kaydet': 'Save',
  'Kapat': 'Close',
  'Şifremi Değiştir': 'Change My Password',
  'Mevcut Şifre': 'Current Password',
  'Yeni Şifre': 'New Password',
  'Yeni Şifre Tekrarı': 'Confirm New Password',
  'Şifreyi Güncelle': 'Update Password',
  'Görünüm Ayarları': 'Appearance Settings',
  'Tema': 'Theme',
  'Yazı Boyutu': 'Font Size',
  'Küçük': 'Small',
  'Normal': 'Normal',
  'Büyük': 'Large',
  'Çok Büyük': 'Extra Large',
  'Açık Füme': 'Light Smoke',
  'Antrasit': 'Anthracite',
  'Lacivert': 'Navy',
  'Adaçayı': 'Sage',
  'Açık Yeşil': 'Light Green',
  'Kayısı': 'Apricot',
  'Kum': 'Sand',
  'Lavanta': 'Lavender',
  'Gül Kurusu': 'Dusty Rose',
  'Açık': 'Light',
  'Ocak': 'January', 'Şubat': 'February', 'Mart': 'March', 'Nisan': 'April', 'Mayıs': 'May', 'Haziran': 'June',
  'Temmuz': 'July', 'Ağustos': 'August', 'Eylül': 'September', 'Ekim': 'October', 'Kasım': 'November', 'Aralık': 'December',
  'Bugün': 'Today', 'Yarın': 'Tomorrow',
  'Aboneliği Sil': 'Delete Subscription',
  'Şablonu Sil': 'Delete Template',
  'Ödeme Yöntemini Sil': 'Delete Payment Method',
  'Geri Yükle': 'Restore',
  'Yedeği Geri Yükle': 'Restore Backup',
'Abonelik Veya Sabit Gider Bilgilerini Girin': 'Enter Subscription Or Fixed Expense Details',
  'Abonelik Yıl Dönümünde': 'On Subscription Anniversary',
  'Aboneliğin Tahsil Edildiği Yöntemi Seçin': 'Select The Payment Method Used For This Subscription',
  'Aktif Bir Abonelik Eklediğinizde Aylık Dağılım Burada Görünür': 'Monthly Distribution Appears Here After You Add An Active Subscription',
  'Ana Panel Bütçe Yılı': 'Dashboard Budget Year',
  'Arka Plan Teması': 'Background Theme',
  'Arka Plan Temasını Ve Yazı Boyutunu Kişiselleştirin': 'Customize The Background Theme And Font Size',
  'Artışın Abonelik Yıl Dönümünde Veya Her Takvim Yılı Başında Devreye Girmesini Seçin': 'Choose Whether The Increase Applies On The Subscription Anniversary Or At The Start Of Each Calendar Year',
  'Ayarları Uygula': 'Apply Settings',
  'Aylık Bütçe Dağılımı': 'Monthly Budget Distribution',
  'Aylık Toplam': 'Monthly Total',
  'Aylık Ödeme Yükü Bulunamadı': 'No Monthly Payment Load Found',
  'Başlangıç / İlk Taksit Tarihi': 'Start / First Installment Date',
  'Başlangıç Ayı Geldiğinde Zam Uygulanır': 'The Increase Applies When The Start Month Arrives',
  'Bildirim E-posta Adresi': 'Notification Email Address',
  'Bitiş Tarihini Görmek İçin Vade İle Başlangıç Ayı/Yılını Girin': 'Enter The Term And Start Month/Year To See The End Date',
  'Bu Abonelik Zaten Kayıtlı': 'This Subscription Is Already Registered',
  'Bu Gün İçin Ödeme Yok': 'No Payment For This Day',
  'Bu Güne Ait Ödemeler': 'Payments For This Day',
  'E-Postadaki Bağlantı Üzerinden Yeni Şifrenizi Belirleyebilirsiniz Cebin PRO Mevcut Şifrenizi Görüntülemez Veya E-Posta İle Göndermez': 'You Can Set A New Password Using The Link In The Email Cebin PRO Does Not View Or Send Your Existing Password By Email',
  'Finansal Analizlerin Gösterileceği Yılı Seçin': 'Select The Year For Financial Analytics',
  'Görünüm Ayarları': 'Appearance Settings',
  'Güvenlik Nedeniyle Önce Mevcut Şifreniz Doğrulanır': 'For Security Your Current Password Is Verified First',
  'Hatırlatıcı E-Postaları Bu Adrese Yönlendirilecektir': 'Reminder Emails Will Be Sent To This Address',
  'Hazır Bir Servis Seçerek Alanları Otomatik Doldurun': 'Choose A Ready Service To Fill The Fields Automatically',
  'Her 1 Ocak Tarihinde Zam Uygulanır': 'The Increase Applies Every January 1',
  'Hesabınıza Bağlı E-Posta Adresini Girin Şifrenizi Güvenli Şekilde Yenileyebilmeniz İçin Firebase Tarafından Bir Sıfırlama Bağlantısı Gönderilecektir': 'Enter The Email Address Linked To Your Account Firebase Will Send A Reset Link So You Can Securely Renew Your Password',
  'Hesap Bilgileri': 'Account Information',
  'Hesap Bilgilerinizi Görüntüleyin Ve Şifrenizi Güvenli Şekilde Güncelleyin': 'View Your Account Information And Securely Update Your Password',
  'Kart Ve Hesap Bazında Aylık Ödeme Yükü': 'Monthly Payment Load By Card And Account',
  'Kredi / Taksit Planı': 'Credit / Installment Plan',
  'Kullanıcı Adı': 'Username',
  'Mevcut Kaydı Düzenleyebilir Veya Aboneliği Farklı Bir Adla Ekleyebilirsiniz': 'You Can Edit The Existing Record Or Add The Subscription With A Different Name',
  'Raporlama Dönemi': 'Reporting Period',
  'Raporlama Yılı': 'Reporting Year',
  'Seçilen Oran, Gelecek Yıllardaki Maliyet Ve Bütçe Projeksiyonlarına Bileşik Olarak Yansıtılır': 'The Selected Rate Is Applied Compounded To Future Cost And Budget Projections',
  'Seçilen Yıl İçin Kategori Verisi Bulunamadı': 'No Category Data Found For The Selected Year',
  'Sonraki ▶': 'Next ▶',
  'Tahmini Son Taksit': 'Estimated Final Installment',
  'Takvim Yılı': 'Calendar Year',
  'Takvim Yılı Başında (Ocak)': 'At The Start Of The Calendar Year (January)',
  'Tarayıcı Bildirimlerinin Çalışması İçin Cihazınızda Ve Tarayıcınızda Bildirim İzninin Açık Olması Gerekir İzin Sorulduğunda “İzin Ver” Seçeneğini Kullanın': 'Browser Notifications Require Notification Permission On Your Device And Browser Choose “Allow” When Permission Is Requested',
  'Toplam': 'Total',
  'Toplam Taksit Sayısı (Vade)': 'Total Installment Count (Term)',
  'Tüm Analizler Seçilen Yıla Göre Güncellenir': 'All Analytics Update According To The Selected Year',
  'Vade Ve İlk Taksit Ayını Girin Kayıt, Son Taksit Ayından Sonra Takvim Ve Raporlarda Otomatik Olarak Sona Erer': 'Enter The Term And First Installment Month The Record Automatically Ends In Calendar And Reports After The Final Installment Month',
  'Yönet': 'Manage',
  'Ödeme Takviminde Görüntülenecek Yılı Seçin': 'Select The Year To Display In The Payment Calendar',
  'Özet Maliyetlerin Hesaplanacağı Projeksiyon Yılını Seçin': 'Select The Projection Year Used For Summary Cost Calculations',
  'Şablonu Kaydet': 'Save Template',
  '◀ Önceki': '◀ Previous',
  '📧 E-posta': '📧 Email',
  '🌐 Tarayıcı Bildirimi': '🌐 Browser Notification',
  '📄 CSV Excel İndir': '📄 Download CSV Excel',
  '🚪 Çıkış Yap': '🚪 Sign Out',
  'Lütfen Ad Soyad veya Kullanıcı Adınızı Giriniz.': 'Please Enter Your Full Name Or Username',
  'Lütfen E-posta Adresinizi Giriniz.': 'Please Enter Your Email Address',
  'Lütfen E-posta veya Kullanıcı Adınızı ve Şifrenizi Giriniz.': 'Please Enter Your Email Or Username And Password',
  'Lütfen Geçerli Bir E-posta Adresi Giriniz.': 'Please Enter A Valid Email Address',
  'Lütfen Tüm Zorunlu Alanları Doldurunuz.': 'Please Fill In All Required Fields',
  'Lütfen Şifrenizi Tekrar Giriniz.': 'Please Enter Your Password Again',
  'Şifre En Az 6 Karakter Olmalıdır.': 'Password Must Be At Least 6 Characters',
  'Şifre ve Şifre Tekrarı Uyuşmuyor. Lütfen Bilgilerinizi Kontrol Ediniz.': 'Password And Confirmation Do Not Match Please Check Your Information',
  'Kullanıcı Adı veya E-posta Bulunamadı.': 'Username Or Email Not Found',
  'Bu Kullanıcı Adıyla Hesap Mevcut': 'An Account With This Username Already Exists',
  'Bu E-posta Adresi Zaten Kullanılıyor.': 'This Email Address Is Already In Use',
  'Geçersiz E-posta Adresi.': 'Invalid Email Address',
  'Şifre Hatalı. Lütfen Tekrar Deneyiniz.': 'Incorrect Password Please Try Again',
  'E-posta/Kullanıcı Adı veya Şifre Hatalı.': 'Email/Username Or Password Is Incorrect',
  'Çok Fazla Deneme Yapıldı. Lütfen Bir Süre Sonra Tekrar Deneyiniz.': 'Too Many Attempts Please Try Again Later',
  'Ağ Bağlantısı Hatası. İnternet Bağlantınızı Kontrol Ediniz.': 'Network Error Please Check Your Internet Connection',
  'Bir Hata Oluştu. Lütfen Tekrar Deneyiniz.': 'An Error Occurred Please Try Again',
  'Bu E-posta Adresiyle Kayıtlı Bir Hesap Bulunamadı.': 'No Account Was Found With This Email Address',
  'Şifre Sıfırlama E-postası Gönderilemedi. Lütfen Tekrar Deneyiniz.': 'Password Reset Email Could Not Be Sent Please Try Again',
  'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.': 'Password Reset Link Was Sent To Your Email Address',
  'Oturumu Kapatmak İstediğinize Emin Misiniz?': 'Are You Sure You Want To Sign Out',
  'Mevcut şifrenizi giriniz.': 'Enter Your Current Password',
  'Yeni şifrenizi giriniz.': 'Enter Your New Password',
  'Yeni şifre en az 6 karakter olmalıdır.': 'New Password Must Be At Least 6 Characters',
  'Yeni şifrenizi tekrar giriniz.': 'Enter Your New Password Again',
  'Şifreler uyuşmuyor.': 'Passwords Do Not Match',
  'Eski şifre yanlış.': 'Current Password Is Incorrect',
  'Oturum bilgileri bulunamadı. Lütfen yeniden giriş yapınız.': 'Session Information Was Not Found Please Sign In Again',
  'Google İle Giriş İçin OAuth Entegrasyonu Yapılandırılmalıdır.': 'OAuth Integration Must Be Configured For Google Sign In',
  'Toplam Finansal Yük: Abonelikler Ve Aktif Kredi Taksitleri Birlikte Gösterilir': 'Total Financial Load: Subscriptions And Active Credit Installments Are Shown Together',
  'Sabit Abonelikler: Kredi Taksitleri Ölçekten Ayrılarak Küçük Giderler Daha Net Görünür': 'Fixed Subscriptions: Credit Installments Are Excluded From The Scale So Smaller Expenses Stay Clear',
  'Detay İçin Bir Aya Dokunun Grafiği Yatay Kaydırabilirsiniz': 'Tap A Month For Details You Can Scroll The Chart Horizontally',
  'Detay İçin Çubukların Üzerine Gelin Veya Tıklayın': 'Hover Over Or Click A Bar For Details',
  'Aylık Ortalama Maliyet': 'Monthly Average Cost',
  'Aylık Ortalama Maliyet Eğilimlerinizi Ve Bütçe Yükünüzü İnceleyin': 'Review Monthly Average Cost Trends And Your Budget Load',
  'Sabit Abonelik Aylık Ortalama Maliyeti': 'Fixed Subscription Monthly Average Cost',
  'Aylık Ortalama Maliyet Grafiği': 'Monthly Average Cost Chart',
  'Henüz Analiz Oluşturmak İçin Yeterli Maliyet Verisi Bulunmuyor.': 'There Is Not Enough Cost Data To Create Analytics Yet.',
  'Lütfen Abonelik veya Gider Adını Giriniz.': 'Please Enter The Subscription Or Expense Name.',
  'Lütfen sıfırdan büyük geçerli bir tutar giriniz.': 'Please Enter A Valid Amount Greater Than Zero.',
  'Ay değeri 1 ile 12 arasında olmalıdır.': 'The Month Value Must Be Between 1 And 12.',
  'Lütfen geçerli bir yıl seçiniz.': 'Please Select A Valid Year.',
  'Yıllık artış oranı 0 ile 100 arasında olmalıdır.': 'The Annual Increase Rate Must Be Between 0 And 100.',
  'Lütfen bir ödeme yöntemi seçiniz.': 'Please Select A Payment Method.',
  'Lütfen bildirimlerin gönderileceği e-posta adresini giriniz.': 'Please Enter The Email Address For Notifications.',
  'Lütfen geçerli bir bildirim e-posta adresi giriniz.': 'Please Enter A Valid Notification Email Address.',
  'Yönetim bağlantısı http:// veya https:// ile başlamalıdır.': 'The Management Link Must Start With http:// Or https://.',
  'Toplam taksit sayısı 1 ile 600 arasında olmalıdır.': 'The Total Installment Count Must Be Between 1 And 600.',
  'İlk taksit ayı 1 ile 12 arasında olmalıdır.': 'The First Installment Month Must Be Between 1 And 12.',
  'İlk taksit yılı 2025 ile 2100 arasında olmalıdır.': 'The First Installment Year Must Be Between 2025 And 2100.',
  'Lütfen şablon adını giriniz.': 'Please Enter The Template Name.',
  'Lütfen sıfırdan büyük geçerli bir şablon fiyatı giriniz.': 'Please Enter A Valid Template Price Greater Than Zero.',
  'Bu isimde bir şablon zaten bulunuyor.': 'A Template With This Name Already Exists.',
  'Lütfen ödeme yöntemi adını giriniz.': 'Please Enter The Payment Method Name.',
  'Bu ödeme yöntemi zaten bulunuyor.': 'This Payment Method Already Exists.',
  'Dışa aktarılacak kayıt bulunmuyor.': 'There Are No Records To Export.',
  'Abonelik listesi bulunamadı.': 'The Subscription List Could Not Be Found.',
  'Yedek başarıyla geri yüklendi.': 'The Backup Was Restored Successfully.',
  'Abonelik Düzenle': 'Edit Subscription',
  'Şablon Adı': 'Template Name',
  'Örn: Netflix, Ev Kirası': 'Example: Netflix, Rent',
  'Örn: Akbank Axess': 'Example: Bank Card',
  'Kredi Kayıtlarında Gün Alanı Taksit Gününü Belirler; Taksit Başlangıç Ayı Ve Yılı Yukarıdaki Kredi / Taksit Planı Alanından Alınır': 'For Credit Records The Day Field Sets The Installment Day; The Installment Start Month And Year Come From The Credit / Installment Plan Above',
  'Aylık Ödemelerde Başlangıç Ayı, Yıllık Ödemelerde Tahsilat Ayı Olarak Kullanılır': 'For Monthly Payments The Month Is Used As The Start Month; For Yearly Payments It Is Used As The Collection Month',
  'Çıkış': 'Exit',
  'Mevcut Şifreniz': 'Your Current Password',
  'Yeni Şifreyi Tekrar Giriniz': 'Enter The New Password Again',
  'Güncelleniyor...': 'Updating...',
  'Taksit': 'Installment',
  'Bitiş': 'Ends',
  'Kayıt': 'Record',
  'Kayıtlar': 'Records',
  'Adım': 'Step',
  'Aylık Vade Tamamlandığında Bu Kalem Rapor Ve Takvim Hesaplamalarından Otomatik Olarak Çıkar': 'This Item Is Automatically Removed From Report And Calendar Calculations After The Monthly Term Is Completed',
  'İsimli Abonelik Zaten Listenizde Bulunuyor': 'Subscription Is Already In Your List',
  'Geçen Aya Göre': 'Vs Previous Month',
  'Yıllık Toplam Maliyet': 'Yearly Total Cost',
  'kayıt': 'records',
  'Yıllık Artış': 'Annual Increase',
  'Taksit · Bitiş': 'Installments · Ends',
  'Aylık Vade Tamamlandığında Bu Kalem Rapor Ve Takvim Hesaplamalarından Otomatik Çıkarılır': 'This Item Is Automatically Removed From Report And Calendar Calculations When The Monthly Term Is Completed'
    },
    calendar: {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    periods: { month: 'month', year: 'year' }
  }
};

const getLocale = language => (language === 'en' ? 'en-US' : 'tr-TR');

const formatUiTitle = (value, language = 'tr') => {
  const locale = getLocale(language);
  const conjunctions = new Set(language === 'en' ? ['and', 'or', 'with'] : ['ve', 'veya', 'ile']);
  const preserveUpper = new Set(['PRO', 'CSV', 'JSON', 'AI', 'USD', 'EUR', 'TRY', 'OAuth', 'Firebase']);
  const input = String(value ?? '');
  if (!input || /https?:\/\//i.test(input) || /^[^\s@]+@[^\s@]+$/.test(input)) return input;
  return input.replace(/[A-Za-zÇĞİÖŞÜçğıöşü]+(?:-[A-Za-zÇĞİÖŞÜçğıöşü]+)*/g, word => {
    if (preserveUpper.has(word)) return word;
    const lower = word.toLocaleLowerCase(locale);
    if (conjunctions.has(lower)) return lower;
    return `${lower.charAt(0).toLocaleUpperCase(locale)}${lower.slice(1)}`;
  });
};

const translateDynamicUiString = (value, language) => {
  if (language !== 'en') return value;
  return String(value)
    .replace(/(\d+) gün kaldı/gi, '$1 Days Left')
    .replace(/Her Ayın\s+(\d+)\.\s+Günü/gi, 'Every Month On Day $1')
    .replace(/(\d+) Taksit · Bitiş\s+([^\d]+)\s+(\d{4})/gi, '$1 Installments · Ends $2 $3')
    .replace(/(\d+) Taksit/gi, '$1 Installments')
    .replace(/Geçen Aya Göre/gi, 'Vs Previous Month')
    .replace(/Yıllık Artış:/gi, 'Annual Increase:')
    .replace(/(\d+) kayıt/gi, '$1 Records')
    .replace(/Seçilen ay için gün 1 ile (\d+) arasında olmalıdır\.?/gi, 'The Day For The Selected Month Must Be Between 1 And $1.')
    .replace(/Bu ödeme yöntemi (\d+) kayıtta kullanılıyor\. Önce ilgili kayıtların ödeme yöntemini değiştiriniz\.?/gi, 'This Payment Method Is Used In $1 Records. Change The Payment Method Of Those Records First.')
    .replace(/(\d+) Kayıt İçe Aktarılacak ve Mevcut Abonelik Listeniz Değiştirilecek\.?/gi, '$1 Records Will Be Imported and Your Existing Subscription List Will Be Replaced.')
    .replace(/Yedek yüklenemedi:\s*(.+)$/gi, 'Backup Could Not Be Loaded: $1')
    .replace(/^"([^"]+)" Aboneliği Kalıcı Olarak Silinecek\. Bu İşlem Geri Alınamaz\.?$/i, '"$1" Subscription Will Be Permanently Deleted. This Action Cannot Be Undone.')
    .replace(/^"([^"]+)" Hızlı Seçim Şablonlarından Kaldırılacak\.?$/i, '"$1" Will Be Removed From Quick Selection Templates.')
    .replace(/^"([^"]+)" Ödeme Yöntemi Listenizden Kaldırılacak\.?$/i, '"$1" Will Be Removed From Your Payment Method List.')
    .replace(/^Kredi • Her Ayın (\d+)\. Günü • (\d+) Taksit$/i, 'Credit • Every Month On Day $1 • $2 Installments')
    .replace(/^"([^"]+)" İsimli Abonelik Zaten Listenizde Bulunuyor\.?$/i, '"$1" Subscription Is Already In Your List.')
    .replace(/(\d+) Aylık Vade Tamamlandığında Bu Kalem Rapor Ve Takvim Hesaplamalarından Otomatik Olarak Çıkar/gi, 'This Item Is Automatically Removed From Report And Calendar Calculations After The $1-Month Term Is Completed')
    .replace(/Adım (\d+) \/ (\d+)/gi, 'Step $1 / $2');
};

const translateUiString = (value, language) => {
  if (typeof value !== 'string') return value;
  const exactTrimmed = value.trim();
  const ui = translations[language]?.ui || translations.tr.ui;
  const sourceIsKnown = Object.prototype.hasOwnProperty.call(translations.en.ui, value) || Object.prototype.hasOwnProperty.call(translations.en.ui, exactTrimmed) || Object.prototype.hasOwnProperty.call(translations.tr.ui, value) || Object.prototype.hasOwnProperty.call(translations.tr.ui, exactTrimmed);
  const direct = language === 'tr'
    ? (translations.tr.ui[value] ?? translations.tr.ui[exactTrimmed] ?? (sourceIsKnown ? exactTrimmed : undefined))
    : (ui[value] ?? ui[exactTrimmed]);
  if (direct !== undefined) {
    const leading = value.match(/^\s*/)?.[0] || '';
    const trailing = value.match(/\s*$/)?.[0] || '';
    return `${leading}${formatUiTitle(direct, language)}${trailing}`;
  }
  const dynamic = translateDynamicUiString(value, language);
  return dynamic !== value ? formatUiTitle(dynamic, language) : value;
};

const translateUiChildren = (children, language) => {
  if (Array.isArray(children)) return children.map(child => translateUiChildren(child, language));
  if (typeof children === 'string') return translateUiString(children, language);
  return children;
};

const Text = ({ children, ...props }) => {
  const language = useContext(LanguageContext);
  return <RNText {...props}>{translateUiChildren(children, language)}</RNText>;
};

const t = (value, language = 'tr') => translateUiString(value, language);
const getMonthName = (monthIndex, language = 'tr') => translations[language]?.calendar?.months?.[monthIndex] || translations.tr.calendar.months[monthIndex] || '';
const getWeekdayShortNames = (language = 'tr') => translations[language]?.calendar?.weekdaysShort || translations.tr.calendar.weekdaysShort;
const getPeriodSuffix = (period, language = 'tr') => translations[language]?.periods?.[period] || translations.tr.periods[period] || period;

const DEFAULT_RATES = { USD: 47.56, EUR: 54.77 };

const CATEGORY_COLORS = {
  Eğlence: '#ef4444',
  'Yazılım & AI': '#8b5cf6',
  Müzik: '#10b981',
  Eğitim: '#f59e0b',
  'Bulut & Depolama': '#3b82f6',
  'Spor & Sağlık': '#ec4899',
  Kredi: '#38bdf8',
  Diğer: '#f97316'
};

const DEFAULT_PAYMENT_METHODS = [
  'Garanti Bonus', 'Enpara Kart', 'Papara', 'İş Bankası Maximum', 'Yapı Kredi World', 'Nakit / Diğer'
];

const DEFAULT_TEMPLATES = [
  { name: 'Netflix', price: '299', currency: 'TRY', category: 'Eğlence', color: '#E50914' },
  { name: 'Spotify', price: '89', currency: 'TRY', category: 'Müzik', color: '#1DB954' },
  { name: 'YouTube Premium', price: '115', currency: 'TRY', category: 'Eğlence', color: '#FF0000' },
  { name: 'ChatGPT Plus', price: '20', currency: 'USD', category: 'Yazılım & AI', color: '#10A37F' },
  { name: 'iCloud+', price: '49.99', currency: 'TRY', category: 'Bulut & Depolama', color: '#007AFF' },
  { name: 'Amazon Prime', price: '49', currency: 'TRY', category: 'Eğlence', color: '#00A8E1' }
];

const TEMPLATE_COLOR_PALETTE = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6', '#8b5cf6', '#f97316', '#06b6d4'];

const NOTIFICATION_OPTIONS = [
  { label: 'Bildirim Yok', badgeLabel: null, value: -1 },
  { label: 'Aynı Gün', badgeLabel: '🔔 Aynı Gün', value: 0 },
  { label: '1 Gün Önce', badgeLabel: '🔔 1 Gün Önce', value: 1 },
  { label: '2 Gün Önce', badgeLabel: '🔔 2 Gün Önce', value: 2 },
  { label: '3 Gün Önce', badgeLabel: '🔔 3 Gün Önce', value: 3 },
  { label: '1 Hafta Önce', badgeLabel: '🔔 1 Hafta Önce', value: 7 }
];

const MONTH_NAMES = translations.tr.calendar.months;

const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

const VIEW_FILTER_OPTIONS = [
  { key: 'ALL', label: 'Tüm Abonelikler' },
  { key: 'MONTHLY', label: 'Aylık Ödemeler' },
  { key: 'YEARLY', label: 'Yıllık Ödemeler' },
  { key: 'UPCOMING', label: 'Yaklaşan Ödemeler' },
  { key: 'EXPENSIVE', label: 'En Yüksek Tutar' },
  { key: 'NAME', label: 'Ada Göre' }
];

const BACKGROUND_PRESETS = {
  smoke: { label: 'Açık Füme', dark: true, bg: '#30353c', sidebarBg: '#373d45', headerBg: '#3a4048', cardBg: '#414852', inputBg: '#343a42', cardBorder: '#58616d', textPrimary: '#f4f6f8', textSecondary: '#d2d7de', textMuted: '#aeb7c2', summaryBg: '#5b58d6', summaryBorder: '#7470ef', accent: '#63b3ff' },
  anthracite: { label: 'Antrasit', dark: true, bg: '#20242a', sidebarBg: '#272c33', headerBg: '#2a3038', cardBg: '#303741', inputBg: '#252b33', cardBorder: '#434c58', textPrimary: '#f4f5f7', textSecondary: '#cbd1d9', textMuted: '#98a2af', summaryBg: '#4f46c8', summaryBorder: '#6860df', accent: '#55aaff' },
  navy: { label: 'Lacivert', dark: true, bg: '#111827', sidebarBg: '#182131', headerBg: '#1c2636', cardBg: '#222d3d', inputBg: '#172131', cardBorder: '#344154', textPrimary: '#f1f5f9', textSecondary: '#cbd5e1', textMuted: '#94a3b8', summaryBg: '#3730a3', summaryBorder: '#4f46e5', accent: '#60a5fa' },
  sage: { label: 'Adaçayı', dark: false, bg: '#dfe8df', sidebarBg: '#cedbce', headerBg: '#eaf1ea', cardBg: '#f5f8f4', inputBg: '#e7eee6', cardBorder: '#afc1ae', textPrimary: '#26352a', textSecondary: '#506353', textMuted: '#748278', summaryBg: '#4f7c5a', summaryBorder: '#6d9977', accent: '#d97706' },
  mint: { label: 'Açık Yeşil', dark: false, bg: '#dff3ea', sidebarBg: '#c9e6d9', headerBg: '#ebf8f2', cardBg: '#f6fcf9', inputBg: '#e3f2eb', cardBorder: '#a8cfbc', textPrimary: '#17392b', textSecondary: '#3f6857', textMuted: '#708d80', summaryBg: '#0f766e', summaryBorder: '#14b8a6', accent: '#ea580c' },
  apricot: { label: 'Kayısı', dark: false, bg: '#f5e3d1', sidebarBg: '#ebd1b8', headerBg: '#faeee3', cardBg: '#fff8f1', inputBg: '#f2e3d5', cardBorder: '#d7bba1', textPrimary: '#3b291d', textSecondary: '#6e5340', textMuted: '#927764', summaryBg: '#d97706', summaryBorder: '#f59e0b', accent: '#0f766e' },
  sand: { label: 'Kum', dark: false, bg: '#eee8dc', sidebarBg: '#e0d7c7', headerBg: '#f5f1e8', cardBg: '#fcfaf5', inputBg: '#ece5d9', cardBorder: '#cbc0ae', textPrimary: '#3a342b', textSecondary: '#665e51', textMuted: '#8a8173', summaryBg: '#8b6f47', summaryBorder: '#a98b60', accent: '#2563eb' },
  lavender: { label: 'Lavanta', dark: false, bg: '#e9e4f4', sidebarBg: '#dcd4eb', headerBg: '#f1edf8', cardBg: '#faf8fd', inputBg: '#e8e2f1', cardBorder: '#c5bad8', textPrimary: '#302740', textSecondary: '#625570', textMuted: '#85768f', summaryBg: '#7c5cbf', summaryBorder: '#9676d4', accent: '#d97706' },
  rose: { label: 'Gül Kurusu', dark: false, bg: '#f1e1e3', sidebarBg: '#e5cfd2', headerBg: '#f8ecee', cardBg: '#fff8f9', inputBg: '#f0dfe2', cardBorder: '#d3b5ba', textPrimary: '#42282e', textSecondary: '#704d55', textMuted: '#93737a', summaryBg: '#be5f73', summaryBorder: '#d17b8d', accent: '#2563eb' },
  light: { label: 'Açık', dark: false, bg: '#edf1f5', sidebarBg: '#ffffff', headerBg: '#ffffff', cardBg: '#ffffff', inputBg: '#f1f4f8', cardBorder: '#d8dee7', textPrimary: '#1f2937', textSecondary: '#566171', textMuted: '#7d8999', summaryBg: '#4f46e5', summaryBorder: '#6366f1', accent: '#2563eb' }
};

const FONT_SCALE_OPTIONS = [
  { key: 'small', label: 'Küçük', scale: 0.9 },
  { key: 'normal', label: 'Normal', scale: 1 },
  { key: 'large', label: 'Büyük', scale: 1.12 },
  { key: 'xlarge', label: 'Çok Büyük', scale: 1.24 }
];

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const formatCurrency = (value, currency = 'TRY') => {
  const n = Number(value) || 0;
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺';
  return `${n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`;
};

const formatShortCurrency = (value, currency = 'TRY') => {
  const n = Number(value) || 0;
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺';
  return `${Math.round(n).toLocaleString('tr-TR')} ${symbol}`;
};

const formatCompactCurrency = (value, currency = 'TRY') => {
  const n = Number(value) || 0;
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺';
  const abs = Math.abs(n);
  if (abs >= 1000000) return `${(n / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} Mn ${symbol}`;
  if (abs >= 1000) return `${(n / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} B ${symbol}`;
  return `${Math.round(n).toLocaleString('tr-TR')} ${symbol}`;
};

// Kart ve raporlarda para birimi + periyot gösterimini tek standarda bağlar.
const formatCurrencyWithPeriod = (value, currency = 'TRY', period = '', language = 'tr') => {
  const amount = formatCurrency(value, currency);
  const suffix = period ? getPeriodSuffix(period, language) : '';
  return suffix ? `${amount} / ${suffix}` : amount;
};

// Analiz ekranındaki aylık tutar göstergelerini tek tip ve dile duyarlı biçimde sunar.
const formatMonthlyMetric = (value, percentage = null, currency = 'TRY', language = 'tr') => {
  const amount = formatCurrencyWithPeriod(value, currency, 'month', language);
  if (percentage === null || percentage === undefined || percentage === '') return amount;
  const numericPercentage = Number(percentage);
  const ratio = Number.isFinite(numericPercentage) ? numericPercentage.toFixed(1) : String(percentage);
  return `${amount} · %${ratio}`;
};

const convertToTL = (price, currency, rates = DEFAULT_RATES) => {
  const p = Number(price) || 0;
  if (currency === 'USD') return p * (Number(rates.USD) || DEFAULT_RATES.USD);
  if (currency === 'EUR') return p * (Number(rates.EUR) || DEFAULT_RATES.EUR);
  return p;
};

const normalizeText = (value = '') => String(value).toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim();

// Uyarı, başlık ve etiketlerde bağlaçları seçili dile göre küçük bırakan merkezi kural.
const toTitleCaseTr = (value, language = 'tr') => formatUiTitle(value, language);

// Küçük açıklama ve bilgi metinleri aynı i18n ve başlık standardından geçer.
const formatUiDescription = (value, language = 'tr') =>
  formatUiTitle(t(String(value ?? '').replace(/\./g, ''), language), language).trim();

const sanitizeNumericInput = (value, options = {}) => {
  const {
    allowDecimal = true,
    max = null,
    maxDecimals = 2
  } = options;

  let cleaned = String(value ?? '').replace(',', '.');
  cleaned = allowDecimal
    ? cleaned.replace(/[^0-9.]/g, '')
    : cleaned.replace(/[^0-9]/g, '');

  if (!allowDecimal) {
    const normalized = cleaned.replace(/^0+(?=\d)/, '');
    if (normalized === '') return '';
    const numericValue = Number(normalized);
    if (Number.isFinite(max) && numericValue > max) return String(max);
    return normalized;
  }

  const firstSeparatorIndex = cleaned.indexOf('.');
  let integerPart = firstSeparatorIndex === -1 ? cleaned : cleaned.slice(0, firstSeparatorIndex);
  let decimalPart = firstSeparatorIndex === -1 ? '' : cleaned.slice(firstSeparatorIndex + 1).replace(/\./g, '');

  integerPart = integerPart.replace(/^0+(?=\d)/, '');
  if (integerPart === '' && firstSeparatorIndex !== -1) integerPart = '0';
  if (integerPart === '' && cleaned !== '') integerPart = '0';
  decimalPart = decimalPart.slice(0, maxDecimals);

  let normalized = integerPart;
  if (firstSeparatorIndex !== -1) normalized += `,${decimalPart}`;

  const numericValue = Number(normalized.replace(',', '.'));
  if (Number.isFinite(max) && Number.isFinite(numericValue) && numericValue > max) {
    return String(max);
  }

  return normalized;
};

const sanitizeDecimalInput = value => sanitizeNumericInput(value, { allowDecimal: true, maxDecimals: 2 });
const sanitizeIntegerInput = value => sanitizeNumericInput(value, { allowDecimal: false });
const sanitizePercentageInput = value => sanitizeNumericInput(value, { allowDecimal: true, max: 100, maxDecimals: 2 });

const isValidUrl = value => {
  if (!value) return true;
  try {
    const u = new URL(value);
    return ['http:', 'https:'].includes(u.protocol);
  } catch { return false; }
};

const getServiceColor = (name, templates) => {
  const source = Array.isArray(templates) && templates.length > 0 ? templates : DEFAULT_TEMPLATES;
  const matched = source.find(t => normalizeText(t.name) === normalizeText(name));
  return matched?.color || '#6366f1';
};

const getNextRenewal = (item, today) => {
  const day = Number(item.billingDay) || 1;
  if (item.period === 'yearly') {
    const month = Math.max(0, Math.min(11, (Number(item.billingMonth) || 1) - 1));
    let d = new Date(today.getFullYear(), month, day);
    if (d < today) d = new Date(today.getFullYear() + 1, month, day);
    return d;
  }
  let d = new Date(today.getFullYear(), today.getMonth(), day);
  if (d < today) d = new Date(today.getFullYear(), today.getMonth() + 1, day);
  return d;
};

const getCycleKey = (item, today) => {
  const next = getNextRenewal(item, today);
  return `${next.getFullYear()}-${next.getMonth()}`;
};

const getAnnualIncreaseMultiplier = (item, targetYear, targetMonthIndex = 0) => {
  const baseYear = Number(item?.billingYear) || targetYear;
  const baseMonthIndex = Math.max(0, Math.min(11, (Number(item?.billingMonth) || 1) - 1));
  const annualIncreaseRate = Math.max(0, Number(item?.annualIncreaseRate) || 0);
  const applicationPeriod = item?.increaseApplicationPeriod || 'calendarYear';

  let elapsedYears = 0;
  if (applicationPeriod === 'anniversary') {
    const elapsedMonths = (targetYear * 12 + targetMonthIndex) - (baseYear * 12 + baseMonthIndex);
    elapsedYears = Math.max(0, Math.floor(elapsedMonths / 12));
  } else {
    elapsedYears = Math.max(0, targetYear - baseYear);
  }

  return Math.pow(1 + annualIncreaseRate / 100, elapsedYears);
};

const getCreditSchedule = item => {
  if (!item || item.category !== 'Kredi') return null;

  const installmentCount = Math.max(0, Number(item.creditInstallmentCount) || 0);
  const startMonth = Math.max(1, Math.min(12, Number(item.creditStartMonth) || Number(item.billingMonth) || 1));
  const startYear = Number(item.creditStartYear) || Number(item.billingYear) || new Date().getFullYear();
  if (!installmentCount) return null;

  const startMonthKey = startYear * 12 + (startMonth - 1);
  const endMonthKey = startMonthKey + installmentCount - 1;
  return {
    installmentCount,
    startMonth,
    startYear,
    startMonthKey,
    endMonthKey,
    endMonth: (endMonthKey % 12) + 1,
    endYear: Math.floor(endMonthKey / 12)
  };
};

const getProjectedSubscriptionPrice = (item, year, monthIndex, rates) => {
  if (!item || item.status === 'cancelled') return 0;
  return convertToTL(item.price, item.currency || 'TRY', rates)
    * getAnnualIncreaseMultiplier(item, year, monthIndex);
};

const getSubscriptionCostForMonth = (item, year, monthIndex, rates) => {
  if (!item || item.status === 'cancelled') return 0;

  const targetMonthKey = year * 12 + monthIndex;
  const creditSchedule = getCreditSchedule(item);
  if (creditSchedule) {
    // Kredi kayıtları yalnızca ilk taksit ile son taksit arasındaki aylarda bütçe ve raporlara dahil edilir.
    if (targetMonthKey < creditSchedule.startMonthKey || targetMonthKey > creditSchedule.endMonthKey) return 0;
    return getProjectedSubscriptionPrice(item, year, monthIndex, rates);
  }

  const billingYear = Number(item.billingYear) || year;
  const billingMonth = Math.max(0, Math.min(11, (Number(item.billingMonth) || 1) - 1));
  const billingMonthKey = billingYear * 12 + billingMonth;
  if (targetMonthKey < billingMonthKey) return 0;

  const priceInTL = getProjectedSubscriptionPrice(item, year, monthIndex, rates);

  if (item.period === 'monthly') return priceInTL;
  return monthIndex === billingMonth ? priceInTL : 0;
};

const lightenHex = (hex, percent) => {
  try {
    const clean = hex.replace('#', '');
    const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
    let r = (num >> 16) + Math.round((255 * percent) / 100);
    let g = ((num >> 8) & 0x00ff) + Math.round((255 * percent) / 100);
    let b = (num & 0x0000ff) + Math.round((255 * percent) / 100);
    r = Math.min(255, Math.max(0, r)); g = Math.min(255, Math.max(0, g)); b = Math.min(255, Math.max(0, b));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  } catch { return hex; }
};

const hexToRgba = (hex, alpha) => {
  try {
    const clean = hex.replace('#', '');
    const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
    const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch { return hex; }
};

// Premium şifre görünürlük ikonu. Varsayılan durumda çizgili göz = şifre gizli.
const PasswordEyeIcon = ({ visible, color = '#b9ddff' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2.5 12s3.6-6 9.5-6 9.5 6 9.5 6-3.6 6-9.5 6-9.5-6-9.5-6Z"
      stroke={color}
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={12} r={2.65} stroke={color} strokeWidth={1.65} />
    {!visible && (
      <Path
        d="M4 4 20 20"
        stroke={color}
        strokeWidth={1.65}
        strokeLinecap="round"
      />
    )}
  </Svg>
);

// Hızlı şablon ve ödeme yöntemi kartlarında kullanılan ince, modern silme ikonu.
const RemoveXIcon = ({ color = '#dbe7ff' }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 7 17 17M17 7 7 17"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
    />
  </Svg>
);


export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 1024;

  const mainScrollRef = useRef(null);
  const mainScrollPositionRef = useRef(0);

  const scrollMainToTop = (animated = false) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainScrollRef.current?.scrollTo?.({ y: 0, animated });
        mainScrollPositionRef.current = 0;
      });
    });
  };

  const restoreMainScrollPosition = position => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainScrollRef.current?.scrollTo?.({ y: Number(position) || 0, animated: false });
      });
    });
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPasswordConfirm, setAuthPasswordConfirm] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [authPasswordVisible, setAuthPasswordVisible] = useState(false);
  const [authPasswordConfirmVisible, setAuthPasswordConfirmVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [language, setLanguage] = useState('tr');
  const registrationFlowRef = useRef(false);

  // Şifremi Unuttum akışı giriş ekranından bağımsız, yalnızca e-posta ile çalışır.
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [isPasswordResetSending, setIsPasswordResetSending] = useState(false);
  const [isForgotPasswordInputFocused, setIsForgotPasswordInputFocused] = useState(false);

  const [subscriptions, setSubscriptions] = useState([]);
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_RATES);
  const [templatesList, setTemplatesList] = useState(DEFAULT_TEMPLATES);
  const [paymentMethodsList, setPaymentMethodsList] = useState(DEFAULT_PAYMENT_METHODS);
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState('list');
  const [viewFilter, setViewFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [backgroundPreset, setBackgroundPreset] = useState('smoke');
  const [fontScaleKey, setFontScaleKey] = useState('normal');
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false);
  const [isAnalysisYearPickerOpen, setIsAnalysisYearPickerOpen] = useState(false);
  const [isCalendarYearPickerOpen, setIsCalendarYearPickerOpen] = useState(false);
  const [isDashboardYearPickerOpen, setIsDashboardYearPickerOpen] = useState(false);

  // Bildirim tercihi: sağ üstteki zil butonuyla açılıp kapatılır, tercih localStorage'da tutulur.
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Form doğrulama ve başarı mesajları aynı kurumsal modal tasarımını kullanır.
  const alertCloseCallbackRef = useRef(null);
  const [alertModal, setAlertModal] = useState({ visible: false, title: 'Eksik veya Hatalı Bilgi', message: '', type: 'error' });
  const showAlert = (message, options = {}) => {
    alertCloseCallbackRef.current = typeof options.onClose === 'function' ? options.onClose : null;
    setAlertModal({
      visible: true,
      title: options.title || 'Eksik veya Hatalı Bilgi',
      message: options.preserveCase ? t(String(message || ''), language) : formatUiTitle(t(message, language), language),
      type: options.type || 'error'
    });
  };
  const closeAlertModal = () => {
    const callback = alertCloseCallbackRef.current;
    alertCloseCallbackRef.current = null;
    setAlertModal(current => ({ ...current, visible: false }));
    if (typeof callback === 'function') callback();
  };

  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState({ username: '', email: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({ current: '', next: '', confirm: '', general: '' });
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [newPasswordConfirmVisible, setNewPasswordConfirmVisible] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });
  const toastTimerRef = useRef(null);

  const showToast = (message, type = 'error') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ visible: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(current => ({ ...current, visible: false }));
    }, 2800);
  };

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  // Tarayıcı confirm() yerine tüm kritik işlemler için uygulama temasıyla uyumlu özel onay modalı.
  const confirmCallbackRef = useRef(null);
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    confirmLabel: 'Tamam',
    cancelLabel: 'İptal',
    tone: 'warning'
  });
  const requestConfirmation = ({ title, message, confirmLabel = 'Tamam', cancelLabel = 'İptal', tone = 'warning', onConfirm }) => {
    confirmCallbackRef.current = onConfirm;
    setConfirmModal({ visible: true, title: formatUiTitle(t(title, language), language), message: formatUiTitle(t(message, language), language), confirmLabel: t(confirmLabel, language), cancelLabel: t(cancelLabel, language), tone });
  };
  const closeConfirmModal = () => {
    confirmCallbackRef.current = null;
    setConfirmModal(current => ({ ...current, visible: false }));
  };
  const approveConfirmModal = () => {
    const callback = confirmCallbackRef.current;
    closeConfirmModal();
    if (typeof callback === 'function') callback();
  };

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [duplicateWarning, setDuplicateWarning] = useState({ visible: false, name: '' });
  const [editingId, setEditingId] = useState(null);

  const [dayDrawer, setDayDrawer] = useState({ visible: false, day: null, month: null, year: null, items: [] });

  const currentDate = new Date();
  const clampedYear = Math.min(2030, Math.max(2025, currentDate.getFullYear()));

  const [calendarMonth, setCalendarMonth] = useState(clampedYear === currentDate.getFullYear() ? currentDate.getMonth() : 0);
  const [calendarYear, setCalendarYear] = useState(clampedYear);
  const [selectedAnalysisYear, setSelectedAnalysisYear] = useState(clampedYear);
  const [selectedDashboardYear, setSelectedDashboardYear] = useState(clampedYear);
  // Analiz ekranında kredi yükünü sabit aboneliklerden ayıran görünüm filtresi.
  const [analyticsIncludeCredits, setAnalyticsIncludeCredits] = useState(false);
  // Mobilde tutar etiketlerinin üst üste binmesini önlemek için seçili ay tek bir bilgi balonunda gösterilir.
  const [selectedChartMonthIndex, setSelectedChartMonthIndex] = useState(null);

  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCurrency, setFormCurrency] = useState('TRY');
  const [formDay, setFormDay] = useState('1');
  const [formMonth, setFormMonth] = useState(String(currentDate.getMonth() + 1));
  const [formYear, setFormYear] = useState(String(clampedYear));
  const [formCategory, setFormCategory] = useState('Eğlence');
  const [formPaymentMethod, setFormPaymentMethod] = useState(DEFAULT_PAYMENT_METHODS[0]);
  const [formPeriod, setFormPeriod] = useState('monthly');
  const [formCancelUrl, setFormCancelUrl] = useState('');
  const [formColor, setFormColor] = useState('#6366f1');
  const [formNotificationDays, setFormNotificationDays] = useState(2);
  const [formNotificationChannel, setFormNotificationChannel] = useState('email');
  const [formNotificationEmail, setFormNotificationEmail] = useState('');
  const [formAnnualIncreaseRate, setFormAnnualIncreaseRate] = useState('0');
  const [formIncreaseApplicationPeriod, setFormIncreaseApplicationPeriod] = useState('anniversary');
  const [formCreditInstallmentCount, setFormCreditInstallmentCount] = useState('');
  const [formCreditStartMonth, setFormCreditStartMonth] = useState(String(currentDate.getMonth() + 1));
  const [formCreditStartYear, setFormCreditStartYear] = useState(String(clampedYear));
  const [focusedNumericInput, setFocusedNumericInput] = useState(null);

  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplatePrice, setNewTemplatePrice] = useState('');
  const [newTemplateCurrency, setNewTemplateCurrency] = useState('TRY');
  const [newTemplateCategory, setNewTemplateCategory] = useState('Diğer');

  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
  const [newPaymentMethodName, setNewPaymentMethodName] = useState('');

  // Kullanıcı verilerini cihazdan bağımsız hale getirmek için Firestore senkronizasyon durumu.
  const [cloudSyncUserId, setCloudSyncUserId] = useState(null);
  const cloudSyncReadyRef = useRef(false);
  const cloudHasAppDataRef = useRef(false);
  const lastCloudAppDataRef = useRef('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      // Kayıt sırasında Firebase hesabı otomatik oturuma açar. Panelin bir an görünmesini engelle.
      if (registrationFlowRef.current) {
        setIsLoggedIn(false);
        if (!firebaseUser) setIsAuthChecking(false);
        return;
      }

      setIsLoggedIn(!!firebaseUser);
      setCloudSyncUserId(firebaseUser?.uid || null);
      if (!firebaseUser) {
        cloudSyncReadyRef.current = false;
        cloudHasAppDataRef.current = false;
        lastCloudAppDataRef.current = '';
      }

      if (firebaseUser) {
        let username = firebaseUser.displayName || '';
        let email = firebaseUser.email || '';
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            username = userDoc.data()?.username || username;
            email = userDoc.data()?.email || email;
          }
        } catch (profileError) {
          console.log('Kullanıcı profili okunamadı:', profileError);
        }
        setCurrentUserProfile({ username, email });
      } else {
        setCurrentUserProfile({ username: '', email: '' });
      }

      setIsAuthChecking(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    try {
      const savedSubscriptions = localStorage.getItem('cebin_subscriptions_v5');
      if (savedSubscriptions) {
        const parsed = JSON.parse(savedSubscriptions);
        setSubscriptions(Array.isArray(parsed) ? parsed : []);
      }
      const savedTemplates = localStorage.getItem('cebin_templates_v1');
      if (savedTemplates) {
        const parsed = JSON.parse(savedTemplates);
        setTemplatesList(Array.isArray(parsed) ? parsed : DEFAULT_TEMPLATES);
      }

      const savedPaymentMethods = localStorage.getItem('cebin_payment_methods_v1');
      if (savedPaymentMethods) {
        const parsed = JSON.parse(savedPaymentMethods);
        setPaymentMethodsList(Array.isArray(parsed) ? parsed : DEFAULT_PAYMENT_METHODS);
      }

      const savedRates = localStorage.getItem('cebin_exchange_rates_v1');
      if (savedRates) {
        const parsed = JSON.parse(savedRates);
        setExchangeRates({ USD: Number(parsed?.USD) || DEFAULT_RATES.USD, EUR: Number(parsed?.EUR) || DEFAULT_RATES.EUR });
      }

      const savedAppearance = localStorage.getItem('cebin_appearance_v1');
      if (savedAppearance) {
        const parsed = JSON.parse(savedAppearance);
        if (BACKGROUND_PRESETS[parsed?.backgroundPreset]) setBackgroundPreset(parsed.backgroundPreset);
        if (FONT_SCALE_OPTIONS.some(o => o.key === parsed?.fontScaleKey)) setFontScaleKey(parsed.fontScaleKey);
      }

      const savedNotifications = localStorage.getItem('cebin_notifications_v1');
      if (savedNotifications !== null) setNotificationsEnabled(savedNotifications === 'true');

      const savedRememberMe = localStorage.getItem('cebin_remember_me_v1');
      if (savedRememberMe !== null) setRememberMe(savedRememberMe === 'true');

      const savedLanguage = localStorage.getItem('cebin_language_v1');
      if (savedLanguage === 'tr' || savedLanguage === 'en') setLanguage(savedLanguage);
    } catch (error) {
      console.log('Kayıtlı veriler okunamadı:', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_subscriptions_v5', JSON.stringify(subscriptions)); } catch (e) { console.log(e); } }, [subscriptions, isLoaded]);
  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_templates_v1', JSON.stringify(templatesList)); } catch (e) { console.log(e); } }, [templatesList, isLoaded]);
  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_payment_methods_v1', JSON.stringify(paymentMethodsList)); } catch (e) { console.log(e); } }, [paymentMethodsList, isLoaded]);
  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_exchange_rates_v1', JSON.stringify(exchangeRates)); } catch (e) { console.log(e); } }, [exchangeRates, isLoaded]);
  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_appearance_v1', JSON.stringify({ backgroundPreset, fontScaleKey })); } catch (e) { console.log(e); } }, [backgroundPreset, fontScaleKey, isLoaded]);
  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_notifications_v1', String(notificationsEnabled)); } catch (e) { console.log(e); } }, [notificationsEnabled, isLoaded]);
  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_remember_me_v1', String(rememberMe)); } catch (e) { console.log(e); } }, [rememberMe, isLoaded]);
  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_language_v1', language); } catch (e) { console.log(e); } }, [language, isLoaded]);
  useEffect(() => { auth.languageCode = language === 'en' ? 'en' : 'tr'; }, [language]);

  // Aynı Firebase hesabıyla web ve telefonda aynı verilerin görünmesi için kullanıcıya özel
  // uygulama verilerini users/{uid}.appData altında gerçek zamanlı senkronize et.
  useEffect(() => {
    if (!isLoaded || !isLoggedIn || !cloudSyncUserId) return undefined;

    cloudSyncReadyRef.current = false;
    const userRef = doc(db, 'users', cloudSyncUserId);

    const unsubscribe = onSnapshot(
      userRef,
      async snapshot => {
        const cloudAppData = snapshot.exists() ? snapshot.data()?.appData : null;

        if (cloudAppData && typeof cloudAppData === 'object') {
          cloudHasAppDataRef.current = true;
          lastCloudAppDataRef.current = JSON.stringify(cloudAppData);

          if (Array.isArray(cloudAppData.subscriptions)) setSubscriptions(cloudAppData.subscriptions);
          if (Array.isArray(cloudAppData.templates)) setTemplatesList(cloudAppData.templates);
          if (Array.isArray(cloudAppData.paymentMethods)) setPaymentMethodsList(cloudAppData.paymentMethods);
          if (BACKGROUND_PRESETS[cloudAppData.backgroundPreset]) setBackgroundPreset(cloudAppData.backgroundPreset);
          if (FONT_SCALE_OPTIONS.some(option => option.key === cloudAppData.fontScaleKey)) setFontScaleKey(cloudAppData.fontScaleKey);
          if (typeof cloudAppData.notificationsEnabled === 'boolean') setNotificationsEnabled(cloudAppData.notificationsEnabled);
        } else {
          // İlk geçişte masaüstündeki mevcut localStorage verisini buluta taşı.
          // Boş bir telefondan giriş yapılması, masaüstündeki verilerin üzerine boş veri yazmasın.
          const hasMeaningfulLocalData =
            subscriptions.length > 0 ||
            JSON.stringify(templatesList) !== JSON.stringify(DEFAULT_TEMPLATES) ||
            JSON.stringify(paymentMethodsList) !== JSON.stringify(DEFAULT_PAYMENT_METHODS) ||
            backgroundPreset !== 'smoke' ||
            fontScaleKey !== 'normal' ||
            notificationsEnabled !== true;

          if (hasMeaningfulLocalData) {
            const initialAppData = {
              subscriptions,
              templates: templatesList,
              paymentMethods: paymentMethodsList,
              backgroundPreset,
              fontScaleKey,
              notificationsEnabled
            };
            const fingerprint = JSON.stringify(initialAppData);
            try {
              await setDoc(userRef, { appData: initialAppData }, { merge: true });
              cloudHasAppDataRef.current = true;
              lastCloudAppDataRef.current = fingerprint;
            } catch (error) {
              console.log('İlk bulut senkronizasyonu yapılamadı:', error);
            }
          }
        }

        cloudSyncReadyRef.current = true;
      },
      error => {
        cloudSyncReadyRef.current = true;
        console.log('Bulut verileri dinlenemedi:', error);
      }
    );

    return unsubscribe;
  }, [isLoaded, isLoggedIn, cloudSyncUserId]);

  // Kullanıcı değişikliklerini kısa bir gecikmeyle Firestore'a yaz. Böylece web ve mobil
  // aynı Firebase hesabında aynı abonelikleri ve kişisel ayarları görür.
  useEffect(() => {
    if (!isLoaded || !isLoggedIn || !cloudSyncUserId || !cloudSyncReadyRef.current) return undefined;

    const hasMeaningfulData =
      subscriptions.length > 0 ||
      cloudHasAppDataRef.current ||
      JSON.stringify(templatesList) !== JSON.stringify(DEFAULT_TEMPLATES) ||
      JSON.stringify(paymentMethodsList) !== JSON.stringify(DEFAULT_PAYMENT_METHODS) ||
      backgroundPreset !== 'smoke' ||
      fontScaleKey !== 'normal' ||
      notificationsEnabled !== true;

    if (!hasMeaningfulData) return undefined;

    const appData = {
      subscriptions,
      templates: templatesList,
      paymentMethods: paymentMethodsList,
      backgroundPreset,
      fontScaleKey,
      notificationsEnabled
    };
    const fingerprint = JSON.stringify(appData);
    if (fingerprint === lastCloudAppDataRef.current) return undefined;

    const timer = setTimeout(async () => {
      try {
        await setDoc(doc(db, 'users', cloudSyncUserId), { appData }, { merge: true });
        cloudHasAppDataRef.current = true;
        lastCloudAppDataRef.current = fingerprint;
      } catch (error) {
        console.log('Bulut senkronizasyonu yapılamadı:', error);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [
    subscriptions,
    templatesList,
    paymentMethodsList,
    backgroundPreset,
    fontScaleKey,
    notificationsEnabled,
    isLoaded,
    isLoggedIn,
    cloudSyncUserId
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchExchangeRates = async () => {
      try {
        const [usdRes, eurRes] = await Promise.all([
          fetch('https://api.frankfurter.dev/v2/rate/USD/TRY?providers=TCMB'),
          fetch('https://api.frankfurter.dev/v2/rate/EUR/TRY?providers=TCMB')
        ]);
        if (!usdRes.ok || !eurRes.ok) throw new Error('Kur servisi yanıt vermedi.');
        const usdData = await usdRes.json();
        const eurData = await eurRes.json();
        if (!isMounted) return;
        const usdRate = Number(usdData?.rate);
        const eurRate = Number(eurData?.rate);
        if (!Number.isFinite(usdRate) || !Number.isFinite(eurRate)) throw new Error('Kur değerleri geçersiz.');
        setExchangeRates({ USD: usdRate, EUR: eurRate });
      } catch (error) {
        console.log('Güncel döviz kurları alınamadı:', error);
      }
    };
    fetchExchangeRates();
    const intervalId = setInterval(fetchExchangeRates, 6 * 60 * 60 * 1000);
    return () => { isMounted = false; clearInterval(intervalId); };
  }, []);

  useEffect(() => { scrollMainToTop(false); }, [activeTab, selectedAnalysisYear]);

const normalizeUsernameKey = value => normalizeText(value).replace(/\s+/g, '');

  const resolveLoginEmail = async identifier => {
    const trimmedIdentifier = identifier.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedIdentifier)) {
      return trimmedIdentifier;
    }
    const usernameKey = normalizeUsernameKey(trimmedIdentifier);
    if (!usernameKey) return null;
    try {
      const usernameDoc = await getDoc(doc(db, 'usernames', usernameKey));
      if (usernameDoc.exists()) {
        return usernameDoc.data().email || null;
      }
    } catch (error) {
      console.log('Kullanıcı adı çözümlenemedi:', error);
    }
    return null;
  };

  const mapFirebaseAuthError = errorCode => {
    const messages = {
      'auth/email-already-in-use': 'Bu E-posta Adresi Zaten Kullanılıyor.',
      'auth/invalid-email': 'Geçersiz E-posta Adresi.',
      'auth/weak-password': 'Şifre En Az 6 Karakter Olmalıdır.',
      'auth/user-not-found': 'Kullanıcı Adı veya E-posta Bulunamadı.',
      'auth/wrong-password': 'Şifre Hatalı. Lütfen Tekrar Deneyiniz.',
      'auth/invalid-credential': 'E-posta/Kullanıcı Adı veya Şifre Hatalı.',
      'auth/too-many-requests': 'Çok Fazla Deneme Yapıldı. Lütfen Bir Süre Sonra Tekrar Deneyiniz.',
      'auth/network-request-failed': 'Ağ Bağlantısı Hatası. İnternet Bağlantınızı Kontrol Ediniz.'
    };
    return t(messages[errorCode] || 'Bir Hata Oluştu. Lütfen Tekrar Deneyiniz.', language);
  };

  const handleLogin = async () => {
    const trimmedName = authName.trim();
    const trimmedIdentifier = authEmail.trim();

    if (authMode === 'register' && !trimmedName) {
      showAlert('Lütfen Ad Soyad veya Kullanıcı Adınızı Giriniz.');
      return;
    }
    if (!trimmedIdentifier || !authPassword) {
      showAlert(authMode === 'register' ? 'Lütfen Tüm Zorunlu Alanları Doldurunuz.' : 'Lütfen E-posta veya Kullanıcı Adınızı ve Şifrenizi Giriniz.');
      return;
    }
    if (authMode === 'register' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedIdentifier)) {
      showAlert('Lütfen Geçerli Bir E-posta Adresi Giriniz.');
      return;
    }
    if (authPassword.length < 6) {
      showAlert('Şifre En Az 6 Karakter Olmalıdır.');
      return;
    }
    if (authMode === 'register' && !authPasswordConfirm) {
      showAlert('Lütfen Şifrenizi Tekrar Giriniz.');
      return;
    }
    if (authMode === 'register' && authPassword !== authPasswordConfirm) {
      showAlert('Şifre ve Şifre Tekrarı Uyuşmuyor. Lütfen Bilgilerinizi Kontrol Ediniz.');
      return;
    }

    setAuthError('');

    try {
      if (authMode === 'register') {
        registrationFlowRef.current = true;
        setIsLoggedIn(false);
        const usernameKey = normalizeUsernameKey(trimmedName);

        const existingUsernameDoc = await getDoc(doc(db, 'usernames', usernameKey));
        if (existingUsernameDoc.exists()) {
          registrationFlowRef.current = false;
          showAlert('Bu Kullanıcı Adıyla Hesap Mevcut', { preserveCase: true });
          return;
        }

        const credential = await createUserWithEmailAndPassword(auth, trimmedIdentifier, authPassword);

        try {
          await updateProfile(credential.user, { displayName: trimmedName });
        } catch (profileError) {
          console.log('Profil adı güncellenemedi:', profileError);
        }

        try {
          await setDoc(doc(db, 'usernames', usernameKey), {
            email: trimmedIdentifier,
            uid: credential.user.uid
          });
          await setDoc(doc(db, 'users', credential.user.uid), {
            username: trimmedName,
            email: trimmedIdentifier
          });
        } catch (firestoreError) {
          console.log('Kullanıcı adı eşlemesi kaydedilemedi:', firestoreError);
        }

        /*
          Firebase, hesap oluşturulduğunda istemci tarafında kullanıcıyı otomatik
          olarak oturuma açar. İstenen davranış "kayıt sonrası otomatik giriş
          yapılmaması" olduğundan, oturum burada bilinçli olarak kapatılır ve
          kullanıcı Giriş Yap ekranına yönlendirilir.
        */
        await signOut(auth);

        setAuthName('');
        setAuthEmail('');
        setAuthPassword('');
        setAuthPasswordConfirm('');

        showAlert('', {
          title: 'Kayıt Başarıyla Gerçekleşti',
          preserveCase: true,
          type: 'success',
          onClose: () => { registrationFlowRef.current = false; setIsLoggedIn(false); setAuthMode('login'); }
        });
        return;
      }

      const resolvedEmail = await resolveLoginEmail(trimmedIdentifier);
      if (!resolvedEmail) {
        showAlert('Kullanıcı Adı veya E-posta Bulunamadı.');
        return;
      }

      if (Platform.OS === 'web') {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      }
      await signInWithEmailAndPassword(auth, resolvedEmail, authPassword);
      setAuthPassword('');
    } catch (error) {
      console.log('Kimlik doğrulama hatası:', error);
      if (authMode === 'register') registrationFlowRef.current = false;
      if (authMode === 'register' && error?.code === 'auth/email-already-in-use') {
        showAlert('Bu Kullanıcı Adıyla Hesap Mevcut', { preserveCase: true });
        return;
      }
      showAlert(mapFirebaseAuthError(error?.code));
    }
  };

  const isValidEmailAddress = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

  const openForgotPassword = () => {
    const loginValue = authEmail.trim();
    setForgotPasswordEmail(isValidEmailAddress(loginValue) ? loginValue : '');
    setForgotPasswordError('');
    setIsForgotPasswordInputFocused(false);
    setIsForgotPasswordOpen(true);
  };

  const closeForgotPassword = () => {
    if (isPasswordResetSending) return;
    setIsForgotPasswordOpen(false);
    setForgotPasswordError('');
    setIsForgotPasswordInputFocused(false);
  };

  const handleForgotPassword = async () => {
    const email = forgotPasswordEmail.trim().toLocaleLowerCase('tr-TR');

    if (!email) {
      setForgotPasswordError('Lütfen E-posta Adresinizi Giriniz.');
      return;
    }

    if (!isValidEmailAddress(email)) {
      setForgotPasswordError('Lütfen Geçerli Bir E-posta Adresi Giriniz.');
      return;
    }

    setForgotPasswordError('');
    setIsPasswordResetSending(true);

    try {
      await sendPasswordResetEmail(auth, email);

      setIsForgotPasswordOpen(false);
      setForgotPasswordEmail('');
      setIsForgotPasswordInputFocused(false);

      showAlert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.', {
        title: 'E-posta Gönderildi',
        preserveCase: true,
        type: 'success'
      });
    } catch (error) {
      console.log('Şifre sıfırlama e-postası gönderilemedi:', error);

      const resetErrorMessages = {
        'auth/invalid-email': 'Geçersiz E-posta Adresi.',
        'auth/user-not-found': 'Bu E-posta Adresiyle Kayıtlı Bir Hesap Bulunamadı.',
        'auth/too-many-requests': 'Çok Fazla Deneme Yapıldı. Lütfen Bir Süre Sonra Tekrar Deneyiniz.',
        'auth/network-request-failed': 'Ağ Bağlantısı Hatası. İnternet Bağlantınızı Kontrol Ediniz.'
      };

      setForgotPasswordError(
        resetErrorMessages[error?.code] || 'Şifre Sıfırlama E-postası Gönderilemedi. Lütfen Tekrar Deneyiniz.'
      );
    } finally {
      setIsPasswordResetSending(false);
    }
  };

  const openUserSettings = async () => {
    const user = auth.currentUser;
    if (!user) return;

    let username = user.displayName || '';
    let email = user.email || '';
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        username = userDoc.data()?.username || username;
        email = userDoc.data()?.email || email;
      }
    } catch (error) {
      console.log('Kullanıcı ayarları yüklenemedi:', error);
    }

    setCurrentUserProfile({ username, email });
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setPasswordErrors({ current: '', next: '', confirm: '', general: '' });
    setIsUserSettingsOpen(true);
  };

  const validatePasswordFields = () => {
    const errors = { current: '', next: '', confirm: '', general: '' };
    if (!currentPassword) errors.current = 'Mevcut şifrenizi giriniz.';
    if (!newPassword) errors.next = 'Yeni şifrenizi giriniz.';
    else if (newPassword.length < 6) errors.next = 'Yeni şifre en az 6 karakter olmalıdır.';
    if (!newPasswordConfirm) errors.confirm = 'Yeni şifrenizi tekrar giriniz.';
    else if (newPassword !== newPasswordConfirm) errors.confirm = 'Şifreler uyuşmuyor.';
    setPasswordErrors(errors);
    const firstError = errors.current || errors.next || errors.confirm;
    if (firstError) showToast(firstError, 'error');
    return !errors.current && !errors.next && !errors.confirm;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordFields()) return;
    const user = auth.currentUser;
    if (!user?.email) {
      setPasswordErrors(current => ({ ...current, general: 'Oturum bilgileri bulunamadı. Lütfen yeniden giriş yapınız.' }));
      return;
    }

    setIsPasswordUpdating(true);
    setPasswordErrors({ current: '', next: '', confirm: '', general: '' });
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      showAlert('', { title: 'Şifreniz Başarıyla Güncellendi', preserveCase: true, type: 'success' });
    } catch (error) {
      console.log('Şifre güncellenemedi:', error);
      if (['auth/wrong-password', 'auth/invalid-credential'].includes(error?.code)) {
        setPasswordErrors(current => ({ ...current, current: 'Eski şifre yanlış.' }));
        showToast('Eski şifre yanlış.', 'error');
      } else if (error?.code === 'auth/weak-password') {
        setPasswordErrors(current => ({ ...current, next: 'Yeni şifre en az 6 karakter olmalıdır.' }));
        showToast('Yeni şifre en az 6 karakter olmalıdır.', 'error');
      } else {
        const message = mapFirebaseAuthError(error?.code);
        setPasswordErrors(current => ({ ...current, general: message }));
        showToast(message, 'error');
      }
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleGoogleLogin = () => {
    setAuthError('Google İle Giriş İçin OAuth Entegrasyonu Yapılandırılmalıdır.');
  };

  const handleLogout = () => {
    requestConfirmation({
      title: 'Oturumu Kapat',
      message: 'Oturumu Kapatmak İstediğinize Emin Misiniz?',
      confirmLabel: 'Çıkış Yap',
      onConfirm: async () => {
        try {
          await signOut(auth);
        } catch (error) {
          console.log('Çıkış yapılamadı:', error);
        }
      }
    });
  };

  const selectedPreset = BACKGROUND_PRESETS[backgroundPreset] || BACKGROUND_PRESETS.smoke;
  const selectedFontOption = FONT_SCALE_OPTIONS.find(o => o.key === fontScaleKey) || FONT_SCALE_OPTIONS[1];
  const fontScale = selectedFontOption.scale;

  const theme = {
    ...selectedPreset,
    danger: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    activeButton: '#6965e8',
    activeButtonBorder: '#7c78f0',
    activeButtonSoft: '#7772ff26'
  };

  const safeList = Array.isArray(subscriptions) ? subscriptions : [];
  const safeTemplates = Array.isArray(templatesList) ? templatesList : [];
  const safePaymentMethods = Array.isArray(paymentMethodsList) ? paymentMethodsList : [];

  const styles = createStyles(theme, isMobile, fontScale);

  const creditInstallmentCountNumber = Math.max(0, Number(formCreditInstallmentCount) || 0);
  const creditStartMonthNumber = Number(formCreditStartMonth);
  const creditStartYearNumber = Number(formCreditStartYear);
  const creditEndPreview = (() => {
    if (formCategory !== 'Kredi') return null;
    if (!Number.isInteger(creditInstallmentCountNumber) || creditInstallmentCountNumber < 1) return null;
    if (!Number.isInteger(creditStartMonthNumber) || creditStartMonthNumber < 1 || creditStartMonthNumber > 12) return null;
    if (!Number.isInteger(creditStartYearNumber) || creditStartYearNumber < 2025 || creditStartYearNumber > 2100) return null;
    const endMonthKey = creditStartYearNumber * 12 + (creditStartMonthNumber - 1) + creditInstallmentCountNumber - 1;
    return {
      month: (endMonthKey % 12) + 1,
      year: Math.floor(endMonthKey / 12),
      monthName: getMonthName(endMonthKey % 12, language)
    };
  })();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return undefined;
    const styleId = 'cebin-subscription-scrollbar-style';
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      .cebin-subscription-scroll, .cebin-main-scroll { scrollbar-width: thin; scrollbar-color: rgba(174,183,194,.42) transparent; }
      .cebin-subscription-scroll::-webkit-scrollbar, .cebin-main-scroll::-webkit-scrollbar { width: 7px; height: 7px; }
      .cebin-subscription-scroll::-webkit-scrollbar-track, .cebin-main-scroll::-webkit-scrollbar-track { background: transparent; margin: 8px 0; }
      .cebin-subscription-scroll::-webkit-scrollbar-thumb, .cebin-main-scroll::-webkit-scrollbar-thumb { background: rgba(174,183,194,.30); border-radius: 999px; border: 2px solid transparent; background-clip: padding-box; }
      .cebin-subscription-scroll::-webkit-scrollbar-thumb:hover, .cebin-main-scroll::-webkit-scrollbar-thumb:hover { background: rgba(174,183,194,.56); border: 2px solid transparent; background-clip: padding-box; }
      .cebin-subscription-scroll::-webkit-scrollbar-corner, .cebin-main-scroll::-webkit-scrollbar-corner { background: transparent; }
    `;
    return undefined;
  }, [theme.cardBorder, theme.textMuted]);

  const todayForFiltering = new Date();

  const filteredSubscriptions = safeList
    .filter(subscription => {
      const query = normalizeText(searchQuery);
      if (!query) return true;
      return [subscription.name, subscription.category, subscription.paymentMethod, subscription.currency]
        .some(v => normalizeText(v).includes(query));
    })
    .filter(subscription => {
      if (viewFilter === 'ALL') return true;
      if (viewFilter === 'MONTHLY') return subscription.period === 'monthly';
      if (viewFilter === 'YEARLY') return subscription.period === 'yearly';
      if (viewFilter === 'UPCOMING') {
        const nextRenewal = getNextRenewal(subscription, todayForFiltering);
        const todayStart = new Date(todayForFiltering.getFullYear(), todayForFiltering.getMonth(), todayForFiltering.getDate());
        const daysUntil = Math.round((nextRenewal - todayStart) / 86400000);
        return daysUntil >= 0 && daysUntil <= 14;
      }
      return true;
    })
    .sort((a, b) => {
      if (viewFilter === 'EXPENSIVE') return convertToTL(b.price, b.currency, exchangeRates) - convertToTL(a.price, a.currency, exchangeRates);
      if (viewFilter === 'NAME') return String(a.name || '').localeCompare(String(b.name || ''), 'tr');
      if (viewFilter === 'UPCOMING') return getNextRenewal(a, todayForFiltering) - getNextRenewal(b, todayForFiltering);
      return String(a.name || '').localeCompare(String(b.name || ''), 'tr');
    });

  const selectedViewFilterLabel = VIEW_FILTER_OPTIONS.find(o => o.key === viewFilter)?.label || 'Tüm Abonelikler';

  const dashboardMetricList = analyticsIncludeCredits
    ? safeList
    : safeList.filter(item => item?.category !== 'Kredi');

  const dashboardMonthlyTotals = Array.from({ length: 12 }, (_, monthIndex) =>
    dashboardMetricList.reduce(
      (total, subscription) => total + getSubscriptionCostForMonth(subscription, selectedDashboardYear, monthIndex, exchangeRates),
      0
    )
  );
  const yearlyProjectionTL = dashboardMonthlyTotals.reduce((total, amount) => total + amount, 0);
  const monthlyTotalTL = yearlyProjectionTL / 12;
  const dailyAverageTL = yearlyProjectionTL / 365;

  const realNow = new Date();
  const prevMonthDate = new Date(realNow.getFullYear(), realNow.getMonth() - 1, 1);
  const thisRealMonthTotal = dashboardMetricList.reduce((t, s) => t + getSubscriptionCostForMonth(s, realNow.getFullYear(), realNow.getMonth(), exchangeRates), 0);
  const prevRealMonthTotal = dashboardMetricList.reduce((t, s) => t + getSubscriptionCostForMonth(s, prevMonthDate.getFullYear(), prevMonthDate.getMonth(), exchangeRates), 0);
  const monthlyChangePercent = prevRealMonthTotal > 0
    ? ((thisRealMonthTotal - prevRealMonthTotal) / prevRealMonthTotal) * 100
    : (thisRealMonthTotal > 0 ? 100 : 0);
  const hasMonthlyChangeData = prevRealMonthTotal > 0 || thisRealMonthTotal > 0;

  const analyticsList = analyticsIncludeCredits
    ? safeList
    : safeList.filter(item => item?.category !== 'Kredi');

  const getDetailedMonthlyBreakdown = (targetYear, sourceList = analyticsList) => {
    const monthlyTotals = Array(12).fill(0);
    const monthlyCategoryBreakdown = Array.from({ length: 12 }, () => []);

    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      let monthTotal = 0;
      const categoryTotals = {};

      sourceList.forEach(subscription => {
        const category = subscription.category || 'Diğer';
        const amount = getSubscriptionCostForMonth(subscription, targetYear, monthIndex, exchangeRates);
        if (amount <= 0) return;
        monthTotal += amount;
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      });

      monthlyTotals[monthIndex] = monthTotal;
      monthlyCategoryBreakdown[monthIndex] = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => ({ category, amount, color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Diğer }));
    }

    return { monthlyTotals, monthlyCategoryBreakdown };
  };

  const { monthlyTotals, monthlyCategoryBreakdown } = getDetailedMonthlyBreakdown(selectedAnalysisYear);
  const totalYearlyExpense = monthlyTotals.reduce((t, a) => t + a, 0);
  const monthsWithExpense = monthlyTotals.filter(a => a > 0).length;
  const averageMonthlyExpense = monthsWithExpense > 0 ? totalYearlyExpense / monthsWithExpense : 0;
  const maxMonthlyExpense = Math.max(...monthlyTotals, 1);

  // Kredi oranı, görünüm filtresinden bağımsız olarak toplam finansal yük üzerinden hesaplanır.
  const fullYearlyExpense = safeList.reduce((total, item) =>
    total + Array.from({ length: 12 }, (_, monthIndex) =>
      getSubscriptionCostForMonth(item, selectedAnalysisYear, monthIndex, exchangeRates)
    ).reduce((sum, amount) => sum + amount, 0), 0
  );
  const yearlyCreditExpense = safeList
    .filter(item => item?.category === 'Kredi')
    .reduce((total, item) =>
      total + Array.from({ length: 12 }, (_, monthIndex) =>
        getSubscriptionCostForMonth(item, selectedAnalysisYear, monthIndex, exchangeRates)
      ).reduce((sum, amount) => sum + amount, 0), 0
    );
  const creditLoadPercent = fullYearlyExpense > 0 ? (yearlyCreditExpense / fullYearlyExpense) * 100 : 0;
  const hasHighCreditLoad = creditLoadPercent >= 70;

  const yearlyCategoryStats = analyticsList.reduce((acc, s) => {
    const category = s.category || 'Diğer';
    const yearlyAmount = Array.from({ length: 12 }, (_, m) => getSubscriptionCostForMonth(s, selectedAnalysisYear, m, exchangeRates)).reduce((t, a) => t + a, 0);
    if (yearlyAmount <= 0) return acc;
    acc[category] = (acc[category] || 0) + yearlyAmount;
    return acc;
  }, {});

  const monthlyPaymentMethodStats = analyticsList.reduce((acc, s) => {
    if (!s || s.status === 'cancelled') return acc;
    const method = s.paymentMethod || 'Nakit / Diğer';
    const startYear = Number(s.billingYear) || selectedAnalysisYear;
    if (startYear > selectedAnalysisYear) return acc;
    const yearlyCommitment = Array.from({ length: 12 }, (_, monthIndex) =>
      getSubscriptionCostForMonth(s, selectedAnalysisYear, monthIndex, exchangeRates)
    ).reduce((total, amount) => total + amount, 0);
    const monthlyCommitment = yearlyCommitment / 12;
    acc[method] = (acc[method] || 0) + monthlyCommitment;
    return acc;
  }, {});

  const sortedMonthlyPaymentMethodEntries = Object.entries(monthlyPaymentMethodStats).sort((a, b) => b[1] - a[1]);
  const totalMonthlyPaymentCommitment = sortedMonthlyPaymentMethodEntries.reduce((total, [, amount]) => total + amount, 0);
  const sortedCategoryEntries = Object.entries(yearlyCategoryStats).sort((a, b) => b[1] - a[1]);
  const categoryMonthDivisor = Math.max(monthsWithExpense, 1);
  const sortedMonthlyCategoryEntries = sortedCategoryEntries.map(([category, amount]) => [category, amount / categoryMonthDivisor]);
  const totalMonthlyCategoryExpense = sortedMonthlyCategoryEntries.reduce((total, [, amount]) => total + amount, 0);
  const topCategoryLabel = sortedCategoryEntries[0]?.[0] || '-';
  const topCategoryAmount = sortedMonthlyCategoryEntries[0]?.[1] || 0;
  const topCategoryPercent = totalMonthlyCategoryExpense > 0 ? ((topCategoryAmount / totalMonthlyCategoryExpense) * 100).toFixed(0) : 0;

  const mostExpensiveSubscription = analyticsList.reduce((current, s) => {
    if (s.status === 'cancelled') return current;
    const priceInTL = convertToTL(s.price, s.currency || 'TRY', exchangeRates);
    const monthlyEquivalent = s.period === 'yearly' ? priceInTL / 12 : priceInTL;
    if (!current || monthlyEquivalent > current.monthlyEquivalent) return { item: s, monthlyEquivalent };
    return current;
  }, null);

  const insightText = (() => {
    if (language === 'en') {
      if (fullYearlyExpense <= 0) return 'There Is Not Enough Cost Data To Create Analytics Yet';
      if (hasHighCreditLoad) return `${selectedAnalysisYear} Credit Installments Make Up Approximately ${creditLoadPercent.toFixed(0)}% Of The Total Financial Load. Credits Are Term-Limited Debt Items; Use The Fixed Subscriptions View To See Your Subscription Budget More Clearly`;
      if (sortedMonthlyCategoryEntries.length === 0) return `${selectedAnalysisYear} There Is Not Enough Data For Regular Costs Excluding Credit.${yearlyCreditExpense > 0 ? ` Credit Load Makes Up ${creditLoadPercent.toFixed(0)}% Of The Total Financial Load` : ''}`;
      return `${selectedAnalysisYear} In ${analyticsIncludeCredits ? 'Total Financial Load' : 'Regular Costs Excluding Credit'}, The Highest Share Is In ${t(topCategoryLabel, language)}: ${formatShortCurrency(topCategoryAmount, 'TRY')} (${topCategoryPercent}%).${mostExpensiveSubscription ? ` The Highest Monthly Cost Impact Comes From ${mostExpensiveSubscription.item.name}` : ''}${!analyticsIncludeCredits && yearlyCreditExpense > 0 ? ` Credits Are Tracked Separately And Make Up ${creditLoadPercent.toFixed(0)}% Of The Total Financial Load` : ''}`;
    }
    if (fullYearlyExpense <= 0) return 'Henüz Analiz Oluşturmak İçin Yeterli Maliyet Verisi Bulunmuyor';
    if (hasHighCreditLoad) return `${selectedAnalysisYear} Döneminde Kredi Taksitleri Toplam Finansal Yükün Yaklaşık %${creditLoadPercent.toFixed(0)}'ini Oluşturuyor. Krediler Süreli Borç Kalemidir; Sabit Abonelik Bütçenizi Daha Net Görmek İçin Grafikte Sabit Abonelikler Görünümünü Kullanabilirsiniz`;
    if (sortedMonthlyCategoryEntries.length === 0) return `${selectedAnalysisYear} Döneminde Kredi Dışındaki Düzenli Maliyetler İçin Yeterli Veri Bulunmuyor.${yearlyCreditExpense > 0 ? ` Kredi Yükü Toplam Finansal Yükün %${creditLoadPercent.toFixed(0)}'ini Oluşturuyor` : ''}`;
    return `${selectedAnalysisYear} Döneminde ${analyticsIncludeCredits ? 'Toplam Finansal Yükte' : 'Kredi Hariç Düzenli Maliyetlerde'} En Yüksek Pay ${topCategoryLabel} Kategorisinde: ${formatShortCurrency(topCategoryAmount, 'TRY')} (%${topCategoryPercent}).${mostExpensiveSubscription ? ` En Yüksek Aylık Maliyet Etkisi ${mostExpensiveSubscription.item.name} Kaydından Geliyor` : ''}${!analyticsIncludeCredits && yearlyCreditExpense > 0 ? ` Krediler Ayrıca İzleniyor ve Toplam Finansal Yükün %${creditLoadPercent.toFixed(0)}'ini Oluşturuyor` : ''}`;
  })();

  const openSubscriptionForm = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormName(item.name || '');
      setFormPrice(String(item.price || ''));
      setFormCurrency(item.currency || 'TRY');
      setFormDay(String(item.billingDay || '1'));
      setFormMonth(String(item.billingMonth || calendarMonth + 1));
      setFormYear(String(item.billingYear || calendarYear));
      setFormCategory(item.category || 'Diğer');
      setFormPaymentMethod(item.paymentMethod || safePaymentMethods[0] || '');
      setFormPeriod(item.period || 'monthly');
      setFormCancelUrl(item.cancelUrl || '');
      setFormColor(item.color || getServiceColor(item.name, safeTemplates));
      setFormNotificationDays(item.notificationDays !== undefined ? item.notificationDays : 2);
      setFormNotificationChannel(item.notificationChannel || 'email');
      setFormNotificationEmail(item.notificationEmail || currentUserProfile.email || auth.currentUser?.email || '');
      setFormAnnualIncreaseRate(String(item.annualIncreaseRate ?? 0));
      setFormIncreaseApplicationPeriod(item.increaseApplicationPeriod || 'calendarYear');
      setFormCreditInstallmentCount(item.category === 'Kredi' ? String(item.creditInstallmentCount || '') : '');
      setFormCreditStartMonth(item.category === 'Kredi' ? String(item.creditStartMonth || item.billingMonth || currentDate.getMonth() + 1) : String(currentDate.getMonth() + 1));
      setFormCreditStartYear(item.category === 'Kredi' ? String(item.creditStartYear || item.billingYear || clampedYear) : String(clampedYear));
    } else {
      setEditingId(null);
      setFormName(''); setFormPrice(''); setFormCurrency('TRY');
      setFormDay('1'); setFormMonth(String(currentDate.getMonth() + 1)); setFormYear(String(clampedYear));
      setFormCategory('Eğlence');
      setFormPaymentMethod(safePaymentMethods[0] || DEFAULT_PAYMENT_METHODS[0]);
      setFormPeriod('monthly'); setFormCancelUrl(''); setFormColor('#6366f1');
      setFormNotificationDays(2); setFormNotificationChannel('email'); setFormNotificationEmail(currentUserProfile.email || auth.currentUser?.email || ''); setFormAnnualIncreaseRate('0'); setFormIncreaseApplicationPeriod('anniversary');
      setFormCreditInstallmentCount(''); setFormCreditStartMonth(String(currentDate.getMonth() + 1)); setFormCreditStartYear(String(clampedYear));
    }
    setFormStep(1);
    setShowTemplateForm(false);
    setShowPaymentMethodForm(false);
    setIsSubscriptionModalOpen(true);
  };

  const closeSubscriptionForm = () => {
    setIsSubscriptionModalOpen(false);
    setEditingId(null);
    setFormStep(1);
    setShowTemplateForm(false);
    setShowPaymentMethodForm(false);
  };

  const goToStepTwo = () => {
    if (!formName.trim()) { showAlert('Lütfen Abonelik veya Gider Adını Giriniz.'); return; }
    const numericPrice = Number(String(formPrice).replace(',', '.'));
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) { showAlert('Lütfen sıfırdan büyük geçerli bir tutar giriniz.'); return; }
    setFormStep(2);
  };

  const handleSaveSubscription = () => {
    const preservedScrollPosition = mainScrollPositionRef.current;
    const normalizedPrice = String(formPrice).replace(',', '.');
    const numericPrice = Number(normalizedPrice);
    const numericDay = Number(formDay);
    const numericMonth = Number(formMonth);
    const numericYear = Number(formYear);
    const numericAnnualIncreaseRate = Number(String(formAnnualIncreaseRate).replace(',', '.'));
    const numericCreditInstallmentCount = Number(formCreditInstallmentCount);
    const numericCreditStartMonth = Number(formCreditStartMonth);
    const numericCreditStartYear = Number(formCreditStartYear);

    if (!formName.trim()) { showAlert('Lütfen Abonelik veya Gider Adını Giriniz.'); return; }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) { showAlert('Lütfen sıfırdan büyük geçerli bir tutar giriniz.'); return; }
    if (!Number.isInteger(numericMonth) || numericMonth < 1 || numericMonth > 12) { showAlert('Ay değeri 1 ile 12 arasında olmalıdır.'); return; }
    if (!YEARS.includes(numericYear)) { showAlert('Lütfen geçerli bir yıl seçiniz.'); return; }
    if (!Number.isFinite(numericAnnualIncreaseRate) || numericAnnualIncreaseRate < 0 || numericAnnualIncreaseRate > 100) { showAlert('Yıllık artış oranı 0 ile 100 arasında olmalıdır.'); return; }

    const maximumDay = getDaysInMonth(numericMonth - 1, numericYear);
    if (!Number.isInteger(numericDay) || numericDay < 1 || numericDay > maximumDay) {
      showAlert(`Seçilen ay için gün 1 ile ${maximumDay} arasında olmalıdır.`);
      return;
    }
    if (!formPaymentMethod) { showAlert('Lütfen bir ödeme yöntemi seçiniz.'); return; }
    if (formNotificationDays !== -1 && formNotificationChannel === 'email') {
      const notificationEmail = formNotificationEmail.trim();
      if (!notificationEmail) { showAlert('Lütfen bildirimlerin gönderileceği e-posta adresini giriniz.'); return; }
      if (!isValidEmailAddress(notificationEmail)) { showAlert('Lütfen geçerli bir bildirim e-posta adresi giriniz.'); return; }
    }
    if (!isValidUrl(formCancelUrl)) { showAlert('Yönetim bağlantısı http:// veya https:// ile başlamalıdır.'); return; }

    let creditSchedulePayload = {
      creditInstallmentCount: null,
      creditStartMonth: null,
      creditStartYear: null,
      creditEndMonth: null,
      creditEndYear: null,
      autoEndAtInstallment: false
    };

    if (formCategory === 'Kredi') {
      if (!Number.isInteger(numericCreditInstallmentCount) || numericCreditInstallmentCount < 1 || numericCreditInstallmentCount > 600) {
        showAlert('Toplam taksit sayısı 1 ile 600 arasında olmalıdır.');
        return;
      }
      if (!Number.isInteger(numericCreditStartMonth) || numericCreditStartMonth < 1 || numericCreditStartMonth > 12) {
        showAlert('İlk taksit ayı 1 ile 12 arasında olmalıdır.');
        return;
      }
      if (!Number.isInteger(numericCreditStartYear) || numericCreditStartYear < 2025 || numericCreditStartYear > 2100) {
        showAlert('İlk taksit yılı 2025 ile 2100 arasında olmalıdır.');
        return;
      }

      const creditEndMonthKey = numericCreditStartYear * 12 + (numericCreditStartMonth - 1) + numericCreditInstallmentCount - 1;
      creditSchedulePayload = {
        creditInstallmentCount: numericCreditInstallmentCount,
        creditStartMonth: numericCreditStartMonth,
        creditStartYear: numericCreditStartYear,
        creditEndMonth: (creditEndMonthKey % 12) + 1,
        creditEndYear: Math.floor(creditEndMonthKey / 12),
        autoEndAtInstallment: true
      };
    }

    const duplicateSubscription = safeList.find(s =>
      s.id !== editingId &&
      normalizeText(s.name) === normalizeText(formName) &&
      s.period === formPeriod &&
      s.status !== 'cancelled'
    );

    if (duplicateSubscription) {
      setDuplicateWarning({ visible: true, name: duplicateSubscription.name || formName.trim() });
      return;
    }

    const existingSubscription = safeList.find(s => s.id === editingId);

    const payload = {
      ...existingSubscription,
      id: editingId || String(Date.now()),
      name: formName.trim(),
      price: String(numericPrice),
      currency: formCurrency,
      billingDay: String(numericDay),
      billingMonth: String(formCategory === 'Kredi' ? numericCreditStartMonth : numericMonth),
      billingYear: String(formCategory === 'Kredi' ? numericCreditStartYear : numericYear),
      category: formCategory,
      paymentMethod: formPaymentMethod,
      period: formPeriod,
      cancelUrl: formCancelUrl.trim(),
      color: formColor,
      notificationDays: formNotificationDays,
      notificationChannel: formNotificationChannel,
      notificationEmail: formNotificationChannel === 'email' ? formNotificationEmail.trim().toLocaleLowerCase('tr-TR') : '',
      annualIncreaseRate: numericAnnualIncreaseRate,
      increaseApplicationPeriod: formIncreaseApplicationPeriod,
      ...creditSchedulePayload,
      status: existingSubscription?.status || 'active'
    };

    const updated = editingId ? safeList.map(s => (s.id === editingId ? payload : s)) : [...safeList, payload];
    setSubscriptions(updated);
    closeSubscriptionForm();
    restoreMainScrollPosition(preservedScrollPosition);
  };

  const handleDeleteSubscription = id => {
    const preservedScrollPosition = mainScrollPositionRef.current;
    const target = safeList.find(s => s.id === id);
    requestConfirmation({
      title: 'Aboneliği Sil',
      message: `"${target?.name || 'Bu Kayıt'}" Aboneliği Kalıcı Olarak Silinecek. Bu İşlem Geri Alınamaz.`,
      confirmLabel: 'Tamam',
      onConfirm: () => {
        setSubscriptions(current => current.filter(s => s.id !== id));
        restoreMainScrollPosition(preservedScrollPosition);
      }
    });
  };

  const togglePaid = subscription => {
    const cycleKey = getCycleKey(subscription, todayForFiltering);
    const isPaid = subscription.paidCycleKey === cycleKey;
    setSubscriptions(safeList.map(s => (s.id === subscription.id ? { ...s, paidCycleKey: isPaid ? null : cycleKey } : s)));
  };

  const addTemplate = () => {
    const numericPrice = Number(String(newTemplatePrice).replace(',', '.'));
    if (!newTemplateName.trim()) { showAlert('Lütfen şablon adını giriniz.'); return; }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) { showAlert('Lütfen sıfırdan büyük geçerli bir şablon fiyatı giriniz.'); return; }
    if (safeTemplates.some(t => normalizeText(t.name) === normalizeText(newTemplateName))) { showAlert('Bu isimde bir şablon zaten bulunuyor.'); return; }

    const templateColor = TEMPLATE_COLOR_PALETTE[safeTemplates.length % TEMPLATE_COLOR_PALETTE.length];
    setTemplatesList([...safeTemplates, { name: newTemplateName.trim(), price: String(numericPrice), currency: newTemplateCurrency, category: newTemplateCategory, color: templateColor }]);
    setNewTemplateName(''); setNewTemplatePrice(''); setNewTemplateCurrency('TRY'); setNewTemplateCategory('Diğer'); setShowTemplateForm(false);
  };

  const removeTemplate = index => {
    const target = safeTemplates[index];
    requestConfirmation({
      title: 'Şablonu Sil',
      message: `"${target?.name || 'Bu Şablon'}" Hızlı Seçim Şablonlarından Kaldırılacak.`,
      confirmLabel: 'Tamam',
      onConfirm: () => setTemplatesList(current => current.filter((_, i) => i !== index))
    });
  };

  const addPaymentMethod = () => {
    const methodName = newPaymentMethodName.trim();
    if (!methodName) { showAlert('Lütfen ödeme yöntemi adını giriniz.'); return; }
    if (safePaymentMethods.some(m => normalizeText(m) === normalizeText(methodName))) { showAlert('Bu ödeme yöntemi zaten bulunuyor.'); return; }
    setPaymentMethodsList([...safePaymentMethods, methodName]);
    setFormPaymentMethod(methodName);
    setNewPaymentMethodName('');
    setShowPaymentMethodForm(false);
  };

  const removePaymentMethod = paymentMethod => {
    const usageCount = safeList.filter(s => s.paymentMethod === paymentMethod).length;
    if (usageCount > 0) { showAlert(`Bu ödeme yöntemi ${usageCount} kayıtta kullanılıyor. Önce ilgili kayıtların ödeme yöntemini değiştiriniz.`); return; }
    requestConfirmation({
      title: 'Ödeme Yöntemini Sil',
      message: `"${paymentMethod}" Ödeme Yöntemi Listenizden Kaldırılacak.`,
      confirmLabel: 'Tamam',
      onConfirm: () => {
        setPaymentMethodsList(current => {
          const updated = current.filter(m => m !== paymentMethod);
          if (formPaymentMethod === paymentMethod) setFormPaymentMethod(updated[0] || '');
          return updated;
        });
      }
    });
  };

  const handleExportCSV = () => {
    if (safeList.length === 0) { showAlert('Dışa aktarılacak kayıt bulunmuyor.'); return; }
    let csvContent = '\uFEFFServis Adi;Fiyat;Para Birimi;Kategori;Odeme Yontemi;Periyot;Odeme Gunu;Odeme Ayi;Odeme Yili;Yillik Artis Orani\n';
    safeList.forEach(s => {
      csvContent += `"${s.name}";${s.price};"${s.currency}";"${s.category}";"${s.paymentMethod}";"${s.period}";${s.billingDay};${s.billingMonth};${s.billingYear};${Number(s.annualIncreaseRate) || 0}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cebin_abonelikler_${calendarYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const backupData = {
      version: 3,
      exportedAt: new Date().toISOString(),
      subscriptions: safeList,
      templates: safeTemplates,
      paymentMethods: safePaymentMethods,
      exchangeRates,
      appearance: { backgroundPreset, fontScaleKey }
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cebin_yedek_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    if (typeof document === 'undefined') return;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json,.json';
    fileInput.onchange = async event => {
      try {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;
        const fileText = await selectedFile.text();
        const parsedBackup = JSON.parse(fileText);
        const importedSubscriptions = Array.isArray(parsedBackup) ? parsedBackup : parsedBackup.subscriptions;
        if (!Array.isArray(importedSubscriptions)) throw new Error('Abonelik listesi bulunamadı.');

        requestConfirmation({
          title: 'Yedeği Geri Yükle',
          message: `${importedSubscriptions.length} Kayıt İçe Aktarılacak ve Mevcut Abonelik Listeniz Değiştirilecek.`,
          confirmLabel: 'Geri Yükle',
          onConfirm: () => {
            setSubscriptions(importedSubscriptions);
            if (Array.isArray(parsedBackup.templates)) setTemplatesList(parsedBackup.templates);
            if (Array.isArray(parsedBackup.paymentMethods)) setPaymentMethodsList(parsedBackup.paymentMethods);
            if (parsedBackup.exchangeRates) {
              setExchangeRates({ USD: Number(parsedBackup.exchangeRates.USD) || DEFAULT_RATES.USD, EUR: Number(parsedBackup.exchangeRates.EUR) || DEFAULT_RATES.EUR });
            }
            const importedAppearance = parsedBackup.appearance;
            if (importedAppearance && BACKGROUND_PRESETS[importedAppearance.backgroundPreset]) setBackgroundPreset(importedAppearance.backgroundPreset);
            if (importedAppearance && FONT_SCALE_OPTIONS.some(o => o.key === importedAppearance.fontScaleKey)) setFontScaleKey(importedAppearance.fontScaleKey);
            showAlert('Yedek başarıyla geri yüklendi.');
          }
        });
      } catch (error) {
        showAlert(`Yedek yüklenemedi: ${error.message}`);
      }
    };
    fileInput.click();
  };

  const daysInCurrentMonth = getDaysInMonth(calendarMonth, calendarYear);
  const firstDayOffset = (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7;

  const handleAnalysisYearChange = year => { scrollMainToTop(false); setSelectedAnalysisYear(year); setSelectedDashboardYear(year); };
  const handleTabChange = tabKey => { scrollMainToTop(false); setActiveTab(tabKey); };

  const openDayDrawer = (dayNumber, itemsForDay) => {
    setDayDrawer({ visible: true, day: dayNumber, month: calendarMonth, year: calendarYear, items: itemsForDay });
  };
if (isAuthChecking) {
    return (
      <LanguageContext.Provider value={language}>
      <SafeAreaView style={[styles.container, { backgroundColor: '#171b2b' }]}>
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#f8fafc', fontSize: 14, fontWeight: '600' }}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
      </LanguageContext.Provider>
    );
  }

  if (!isLoggedIn) {
    const authBackgroundStyle = Platform.OS === 'web'
      ? {
          backgroundColor: '#171b2b',
          backgroundImage: 'radial-gradient(circle at 20% 18%, rgba(105,101,232,0.20) 0%, transparent 34%), radial-gradient(circle at 82% 78%, rgba(59,130,246,0.14) 0%, transparent 32%), linear-gradient(145deg, #171b2b 0%, #22283a 52%, #171c2a 100%)'
        }
      : { backgroundColor: '#171b2b' };

    return (
      <LanguageContext.Provider value={language}>
      <SafeAreaView style={[styles.container, authBackgroundStyle]}>
        <StatusBar barStyle="light-content" />
        <View pointerEvents="none" style={[styles.authGlow, styles.authGlowTop]} />
        <View pointerEvents="none" style={[styles.authGlow, styles.authGlowBottom]} />

        <ScrollView
          style={styles.authScroll}
          contentContainerStyle={styles.authScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.authWrapper}>
            <View
              style={[
                styles.authCard,
                styles.glassSurface,
                {
                  backgroundColor: Platform.OS === 'web' ? 'rgba(48,55,70,0.90)' : '#303746',
                  borderColor: 'rgba(154,163,184,0.32)',
                  ...(Platform.OS === 'web'
                    ? { boxShadow: '0 28px 80px rgba(3,7,18,0.52), 0 8px 28px rgba(79,70,229,0.16)' }
                    : {})
                }
              ]}
            >
              <View style={styles.authTopUtilityRow}>
                <View style={styles.languageSegment}>
                  {['tr', 'en'].map(option => (
                    <Pressable
                      key={option}
                      onPress={() => setLanguage(option)}
                      style={[styles.languageSegmentButton, language === option && styles.languageSegmentButtonActive]}
                    >
                      <Text style={[styles.languageSegmentText, language === option && styles.languageSegmentTextActive]}>{option.toUpperCase()}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={styles.authHeader}>
                <Text style={[styles.authLogo, { color: '#f8fafc' }]}>Cebin <Text style={{ color: '#9b98ff' }}>PRO</Text></Text>
                <Text style={[styles.authSubtitle, { color: '#c5cbd6' }]}>Akıllı Abonelik Ve Bütçe Asistanı</Text>
              </View>

              <Text style={[styles.authTitle, { color: '#f8fafc' }]}>{authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</Text>

              {authMode === 'register' && (
                <View style={styles.authFieldGroup}>
                  <Text style={[styles.inputLabel, styles.authFieldLabel, { color: '#d2d7e0' }]}>Ad Soyad / Kullanıcı Adı</Text>
                  <TextInput
                    style={[styles.textInput, styles.authTextInput, { backgroundColor: '#252b38', color: '#f8fafc', borderColor: '#566071' }]}
                    placeholder={t('Ad Soyad veya Kullanıcı Adı', language)}
                    placeholderTextColor="#8f98a8"
                    autoCapitalize="words"
                    value={authName}
                    onChangeText={setAuthName}
                  />
                </View>
              )}

              <View style={styles.authFieldGroup}>
                <Text style={[styles.inputLabel, styles.authFieldLabel, { color: '#d2d7e0' }]}>{authMode === 'login' ? 'E-posta / Kullanıcı Adı' : 'E-posta'}</Text>
                <TextInput
                  style={[styles.textInput, styles.authTextInput, { backgroundColor: '#252b38', color: '#f8fafc', borderColor: '#566071' }]}
                  placeholder={authMode === 'login' ? t('E-posta / Kullanıcı Adı', language) : (language === 'en' ? 'example@email.com' : 'ornek@eposta.com')}
                  placeholderTextColor="#8f98a8"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  autoCorrect={false}
                  {...(Platform.OS === 'web' ? { name: 'email' } : {})}
                  value={authEmail}
                  onChangeText={setAuthEmail}
                />
              </View>

              <View style={styles.authFieldGroup}>
                <Text style={[styles.inputLabel, styles.authFieldLabel, { color: '#d2d7e0' }]}>Şifre</Text>
                <View style={[styles.passwordInputShell, { backgroundColor: '#252b38', borderColor: '#566071' }]}>
                  <TextInput
                    style={[styles.authPasswordInput, { color: '#f8fafc' }]}
                    placeholder="••••••••"
                    placeholderTextColor="#8f98a8"
                    secureTextEntry={!authPasswordVisible}
                    autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                    value={authPassword}
                    onChangeText={setAuthPassword}
                  />
                  <Pressable style={({ hovered, pressed }) => [styles.eyeButton, (hovered || pressed) && styles.eyeButtonHover]} onPress={() => setAuthPasswordVisible(value => !value)}>
                    <PasswordEyeIcon visible={authPasswordVisible} />
                  </Pressable>
                </View>
                {authMode === 'login' && (
                  <TouchableOpacity style={styles.forgotPasswordButton} onPress={openForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
                  </TouchableOpacity>
                )}
              </View>

              {authMode === 'login' && (
                <Pressable style={styles.rememberRow} onPress={() => setRememberMe(value => !value)}>
                  <View style={[styles.rememberCheckbox, rememberMe && styles.rememberCheckboxActive]}>
                    {rememberMe && <Text style={styles.rememberCheckMark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberLabel}>Beni Hatırla</Text>
                </Pressable>
              )}

              {authMode === 'register' && (
                <View style={styles.authFieldGroup}>
                  <Text style={[styles.inputLabel, styles.authFieldLabel, { color: '#d2d7e0' }]}>Şifre Tekrarı</Text>
                  <View style={[styles.passwordInputShell, { backgroundColor: '#252b38', borderColor: '#566071' }]}>
                    <TextInput
                      style={[styles.authPasswordInput, { color: '#f8fafc' }]}
                      placeholder="••••••••"
                      placeholderTextColor="#8f98a8"
                      secureTextEntry={!authPasswordConfirmVisible}
                      autoComplete="new-password"
                      value={authPasswordConfirm}
                      onChangeText={setAuthPasswordConfirm}
                    />
                    <Pressable style={({ hovered, pressed }) => [styles.eyeButton, (hovered || pressed) && styles.eyeButtonHover]} onPress={() => setAuthPasswordConfirmVisible(value => !value)}>
                      <PasswordEyeIcon visible={authPasswordConfirmVisible} />
                    </Pressable>
                  </View>
                </View>
              )}

              {!!authError && <Text style={styles.authErrorText}>{authError}</Text>}

              <TouchableOpacity style={[styles.primaryButton, styles.authPrimaryButton]} onPress={handleLogin}>
                <Text style={styles.primaryButtonText}>{authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
              </TouchableOpacity>

              <View style={styles.authDividerRow}>
                <View style={styles.authDividerLine} />
                <Text style={styles.authDividerText}>veya</Text>
                <View style={styles.authDividerLine} />
              </View>

              <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                <View style={styles.googleIconBox}><Text style={styles.googleIconText}>G</Text></View>
                <Text style={styles.googleButtonText}>Google İle Devam Et</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.authSwitchButton} onPress={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); closeAlertModal(); setAuthPassword(''); setAuthPasswordConfirm(''); }}>
                <Text style={[styles.authSwitchText, { color: '#63b3ff' }]}>
                  {authMode === 'login' ? 'Hesabın Yok Mu? Kayıt Ol' : 'Zaten Hesabın Var Mı? Giriş Yap'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Modal visible={isForgotPasswordOpen} transparent animationType="fade" onRequestClose={closeForgotPassword}>
          <View style={styles.warningOverlay}>
            <Pressable style={styles.forgotPasswordBackdrop} onPress={closeForgotPassword} />
            <View
              style={[
                styles.forgotPasswordModal,
                styles.glassSurface,
                {
                  backgroundColor: Platform.OS === 'web' ? 'rgba(48,55,70,0.97)' : '#303746',
                  borderColor: '#566071',
                  ...(Platform.OS === 'web'
                    ? { boxShadow: '0 28px 80px rgba(3,7,18,0.55), 0 8px 28px rgba(79,70,229,0.18)' }
                    : {})
                }
              ]}
            >
              <View style={styles.forgotPasswordModalHeader}>
                <View style={styles.forgotPasswordIconBox}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <Path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Z" stroke="#b9ddff" strokeWidth={1.55} />
                    <Path d="m5.2 7 6.8 5.15L18.8 7" stroke="#9b98ff" strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
                <Pressable
                  style={({ hovered, pressed }) => [styles.forgotPasswordCloseButton, (hovered || pressed) && styles.forgotPasswordCloseButtonHover]}
                  onPress={closeForgotPassword}
                  disabled={isPasswordResetSending}
                >
                  <RemoveXIcon color="#c5cbd6" />
                </Pressable>
              </View>

              <Text style={styles.forgotPasswordTitle}>Şifremi Unuttum</Text>
              <Text style={styles.forgotPasswordDescription}>
                Hesabınıza Bağlı E-Posta Adresini Girin Şifrenizi Güvenli Şekilde Yenileyebilmeniz İçin Firebase Tarafından Bir Sıfırlama Bağlantısı Gönderilecektir
              </Text>

              <View style={styles.forgotPasswordFieldGroup}>
                <Text style={styles.forgotPasswordLabel}>E-posta Adresi</Text>
                <TextInput
                  style={[
                    styles.forgotPasswordInput,
                    {
                      borderColor: forgotPasswordError
                        ? '#f87171'
                        : isForgotPasswordInputFocused
                          ? '#7c78f0'
                          : '#566071'
                    },
                    isForgotPasswordInputFocused && styles.forgotPasswordInputFocused
                  ]}
                  placeholder="ornek@eposta.com"
                  placeholderTextColor="#8f98a8"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  autoComplete="email"
                  value={forgotPasswordEmail}
                  onChangeText={value => {
                    setForgotPasswordEmail(value.replace(/\s/g, ''));
                    if (forgotPasswordError) setForgotPasswordError('');
                  }}
                  onFocus={() => setIsForgotPasswordInputFocused(true)}
                  onBlur={() => setIsForgotPasswordInputFocused(false)}
                  onSubmitEditing={handleForgotPassword}
                  editable={!isPasswordResetSending}
                />
                {!!forgotPasswordError && (
                  <Text style={styles.forgotPasswordErrorText}>{forgotPasswordError}</Text>
                )}
              </View>

              <View style={styles.forgotPasswordInfoBox}>
                <Text style={styles.forgotPasswordInfoIcon}>i</Text>
                <Text style={styles.forgotPasswordInfoText}>
                  E-Postadaki Bağlantı Üzerinden Yeni Şifrenizi Belirleyebilirsiniz Cebin PRO Mevcut Şifrenizi Görüntülemez Veya E-Posta İle Göndermez
                </Text>
              </View>

              <View style={styles.forgotPasswordActions}>
                <Pressable
                  style={({ hovered, pressed }) => [
                    styles.forgotPasswordSecondaryButton,
                    (hovered || pressed) && styles.forgotPasswordSecondaryButtonHover
                  ]}
                  onPress={closeForgotPassword}
                  disabled={isPasswordResetSending}
                >
                  <Text style={styles.forgotPasswordSecondaryButtonText}>Vazgeç</Text>
                </Pressable>

                <Pressable
                  style={({ hovered, pressed }) => [
                    styles.forgotPasswordPrimaryButton,
                    (hovered || pressed) && styles.premiumButtonHover,
                    isPasswordResetSending && styles.forgotPasswordButtonDisabled
                  ]}
                  onPress={handleForgotPassword}
                  disabled={isPasswordResetSending}
                >
                  <Text style={styles.forgotPasswordPrimaryButtonText}>
                    {isPasswordResetSending ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={alertModal.visible} transparent animationType="fade" onRequestClose={closeAlertModal}>
          <View style={styles.warningOverlay}>
            <View style={[styles.warningCard, { backgroundColor: '#303746', borderColor: '#566071' }]}>
              <View style={[styles.warningIconBox, alertModal.type === 'success' ? styles.successIconBox : { backgroundColor: 'rgba(105,101,232,0.14)', borderColor: '#7c78f0' }]}>
                {alertModal.type === 'success' ? (
                  <Text style={styles.successCheck}>✓</Text>
                ) : (
                  <View style={styles.warningTriangle}>
                    <Text style={styles.warningBang}>!</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.warningTitle, { color: '#f8fafc' }]}>{alertModal.title}</Text>
              {!!alertModal.message && <Text style={[styles.warningMessage, { color: '#d2d7e0', marginBottom: 22 }]}>{alertModal.message}</Text>}
              <Pressable style={({ hovered, pressed }) => [styles.warningButton, (hovered || pressed) && styles.premiumButtonHover]} onPress={closeAlertModal}>
                <Text style={styles.warningButtonText}>Tamam</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      </LanguageContext.Provider>
    );
  }

  const appBackgroundStyle = Platform.OS === 'web'
    ? {
        backgroundColor: theme.bg,
        backgroundImage: `radial-gradient(circle at 14% 10%, ${hexToRgba(theme.activeButton, 0.16)} 0%, transparent 32%), radial-gradient(circle at 88% 84%, ${hexToRgba(theme.accent, 0.10)} 0%, transparent 30%), linear-gradient(145deg, ${theme.bg} 0%, ${lightenHex(theme.bg, 3)} 48%, ${theme.bg} 100%)`
      }
    : { backgroundColor: theme.bg };

  return (
    <LanguageContext.Provider value={language}>
    <SafeAreaView style={[styles.container, appBackgroundStyle]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <View pointerEvents="none" style={[styles.appGlow, styles.appGlowTop, { backgroundColor: theme.activeButton }]} />
      <View pointerEvents="none" style={[styles.appGlow, styles.appGlowBottom, { backgroundColor: theme.accent }]} />

      <View style={[styles.appWrapper, isDesktop && styles.appWrapperDesktop]}>
        {isDesktop && (
          <View style={[styles.sidebarContainer, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.sidebarBg, 0.82) : theme.sidebarBg, borderRightColor: theme.cardBorder }]}>
            <View style={styles.sidebarHeader}>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cebin</Text>
              <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>
            </View>

            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Akıllı Abonelik Ve Bütçe Asistanı</Text>

            <View style={styles.sidebarNavGroup}>
              {[
                { key: 'list', icon: '💳', label: 'Abonelikler' },
                { key: 'calendar', icon: '📅', label: 'Takvim' },
                { key: 'analytics', icon: '📊', label: 'Analiz ve Raporlar' }
              ].map(navItem => (
                <TouchableOpacity key={navItem.key} style={[styles.sidebarNavButton, activeTab === navItem.key && styles.sidebarNavButtonActive]} onPress={() => handleTabChange(navItem.key)}>
                  <Text style={styles.sidebarNavIcon}>{navItem.icon}</Text>
                  <Text style={[styles.sidebarNavText, { color: activeTab === navItem.key ? '#9b98ff' : theme.textSecondary }]}>{navItem.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sidebarFooter}>
              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={handleExportCSV}>
                <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>📄 CSV Excel İndir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={openUserSettings}>
                <View style={styles.userSettingsButtonContent}><View style={styles.profileGlyph}><View style={styles.profileGlyphHead} /><View style={styles.profileGlyphBody} /></View><Text style={[styles.secondaryButtonText, { color: '#8bd5ff' }]}>Kullanıcı Ayarları</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={() => openSubscriptionForm()}>
                <Text style={styles.primaryButtonText}>+ Yeni Abonelik Ekle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: 'rgba(248,113,113,0.12)', borderColor: theme.danger }]} onPress={handleLogout}>
                <Text style={[styles.secondaryButtonText, { color: theme.danger }]}>🚪 Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.contentWrapper}>
          <View style={[styles.header, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.headerBg, 0.75) : theme.headerBg, borderBottomColor: theme.cardBorder }]}>
            <View style={styles.pageHeaderInfo}>
              <Text style={[styles.pageHeaderTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                {activeTab === 'list' ? 'Abonelikler' : activeTab === 'calendar' ? 'Ödeme Takvimi' : 'Analiz ve Raporlar'}
              </Text>
              <Text style={[styles.pageHeaderDescription, { color: theme.textSecondary }]} numberOfLines={isMobile ? 2 : 1}>
                {activeTab === 'list' ? 'Aboneliklerinizi Ve Düzenli Ödemelerinizi Yönetin' : activeTab === 'calendar' ? 'Yaklaşan Ödeme Tarihlerini Takvim Üzerinden Takip Edin' : 'Aylık Ortalama Maliyet Eğilimlerinizi Ve Bütçe Yükünüzü İnceleyin'}
              </Text>
            </View>

            <View style={styles.headerActions}>
              {isDesktop && (
                <View style={[styles.miniRatesBadge, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                  <Text style={styles.miniRatesIcon}>💱</Text>
                  <Text style={[styles.miniRatesText, { color: theme.textSecondary }]} numberOfLines={1}>
                    USD {Number(exchangeRates.USD).toFixed(2)} · EUR {Number(exchangeRates.EUR).toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={[styles.languageSegment, styles.headerLanguageSegment, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                {['tr', 'en'].map(option => (
                  <Pressable
                    key={option}
                    onPress={() => setLanguage(option)}
                    style={[styles.languageSegmentButton, language === option && styles.languageSegmentButtonActive]}
                  >
                    <Text style={[styles.languageSegmentText, { color: theme.textSecondary }, language === option && styles.languageSegmentTextActive]}>{option.toUpperCase()}</Text>
                  </Pressable>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}
                onPress={() => setNotificationsEnabled(v => !v)}
              >
                <Text style={styles.iconButtonText}>{notificationsEnabled ? '🔔' : '🔕'}</Text>
              </TouchableOpacity>

              {isDesktop && (
                <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={openUserSettings}>
                  <View style={styles.profileGlyph}><View style={styles.profileGlyphHead} /><View style={styles.profileGlyphBody} /></View>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => setIsAppearanceModalOpen(true)}>
                <Text style={styles.iconButtonText}>⚙️</Text>
              </TouchableOpacity>

              {!isDesktop && (
                <TouchableOpacity style={styles.primaryButton} onPress={() => openSubscriptionForm()}>
                  <Text style={styles.primaryButtonText}>+ Ekle</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            className="cebin-main-scroll"
            ref={mainScrollRef}
            style={[styles.mainScroll, { overflowAnchor: 'none', scrollbarWidth: 'thin', scrollbarColor: `${theme.cardBorder} transparent` }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator
            scrollEventThrottle={16}
            onScroll={event => { mainScrollPositionRef.current = event.nativeEvent.contentOffset.y; }}
          >
            {activeTab === 'list' && (
              <>
                <View style={[styles.summaryCard, styles.elevatedSurface, { backgroundColor: theme.summaryBg, borderColor: theme.summaryBorder }] }>
                  <View style={styles.summaryTopRow}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <View style={styles.summaryLabelRow}>
                        <Text style={styles.summaryLabel}>{selectedDashboardYear} {t('Aylık Ortalama Maliyet', language)} · {analyticsIncludeCredits ? t('Toplam Finansal Yük', language) : t('Sabit Abonelikler', language)}</Text>
                        {selectedDashboardYear === currentDate.getFullYear() && hasMonthlyChangeData && (
                          <View style={[styles.changeBadge, { backgroundColor: monthlyChangePercent <= 0 ? 'rgba(52,211,153,0.22)' : 'rgba(248,113,113,0.22)' }]}>
                            <Text style={[styles.changeBadgeText, { color: monthlyChangePercent <= 0 ? '#34d399' : '#f87171' }]}>
                              {monthlyChangePercent <= 0 ? '↓' : '↑'} %{Math.abs(monthlyChangePercent).toFixed(1)} Geçen Aya Göre
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.82}
                      style={styles.dashboardYearButton}
                      onPress={() => setIsDashboardYearPickerOpen(true)}
                    >
                      <View>
                        <Text style={styles.dashboardYearCaption}>Bütçe Yılı</Text>
                        <Text style={styles.dashboardYearValue}>{selectedDashboardYear}</Text>
                      </View>
                      <Text style={styles.dashboardYearChevron}>⌄</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.summaryValue}>{formatCurrency(monthlyTotalTL, 'TRY')}</Text>

                  <View style={styles.summaryStatsRow}>
                    <View style={styles.summaryStatBox}>
                      <Text style={styles.summaryStatLabel}>Günlük Maliyet</Text>
                      <Text style={styles.summaryStatValue}>{formatCurrency(dailyAverageTL, 'TRY')}</Text>
                    </View>
                    <View style={styles.summaryStatBox}>
                      <Text style={styles.summaryStatLabel}>{selectedDashboardYear} Yıllık Toplam Maliyet</Text>
                      <Text style={styles.summaryStatValue}>{formatCurrency(yearlyProjectionTL, 'TRY')}</Text>
                    </View>
                  </View>
                </View>

                <TextInput
                  style={[styles.searchInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
                  placeholder={language === 'en' ? 'Search Subscription, Category Or Payment Method...' : 'Abonelik, Kategori veya Ödeme Yöntemi Ara...'}
                  placeholderTextColor={theme.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />

                <View style={[styles.singleFilterSection, styles.elevatedSurface, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.86) : theme.cardBg, borderColor: theme.cardBorder }] }>
                  <View style={styles.filterSectionHeader}>
                    <View>
                      <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>Görünüm Filtresi</Text>
                      <Text style={[styles.filterSectionHint, { color: theme.textMuted }]}>Abonelik Listenizi Tek Dokunuşla Daraltın</Text>
                    </View>
                    <View style={[styles.activeFilterBadge, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
                      <Text style={[styles.activeFilterBadgeText, { color: theme.accent }]}>{selectedViewFilterLabel}</Text>
                    </View>
                  </View>
                  <View style={styles.filterOptionGrid}>
                    {VIEW_FILTER_OPTIONS.map(option => {
                      const isSelected = viewFilter === option.key;
                      return (
                        <TouchableOpacity
                          key={option.key}
                          activeOpacity={0.82}
                          style={[
                            styles.filterOption,
                            { backgroundColor: theme.inputBg, borderColor: theme.cardBorder },
                            isSelected && styles.filterOptionActive
                          ]}
                          onPress={() => setViewFilter(option.key)}
                        >
                          <Text style={[styles.filterOptionText, { color: theme.textSecondary }, isSelected && styles.filterOptionTextActive]}>{option.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.sectionTitleRow}>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{selectedViewFilterLabel}</Text>
                  <Text style={[styles.resultCount, { color: theme.textMuted }]}>{filteredSubscriptions.length} kayıt</Text>
                </View>

                {filteredSubscriptions.length === 0 ? (
                  <View style={[styles.emptyCard, styles.elevatedSurface, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.88) : theme.cardBg, borderColor: theme.cardBorder }] }>
                    <Text style={styles.emptyIcon}>💳</Text>
                    <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Kayıt Bulunamadı</Text>
                    <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>Arama Metnini Veya Görünüm Filtresini Değiştiriniz</Text>
                    <TouchableOpacity style={[styles.primaryButton, { marginTop: 14 }]} onPress={() => openSubscriptionForm()}>
                      <Text style={styles.primaryButtonText}>+ Abonelik Ekle</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  filteredSubscriptions.map(subscription => {
                    const priceInTL = convertToTL(subscription.price, subscription.currency || 'TRY', exchangeRates);
                    const notificationOption = NOTIFICATION_OPTIONS.find(o => o.value === subscription.notificationDays) || NOTIFICATION_OPTIONS[3];
                    const serviceColor = subscription.color || getServiceColor(subscription.name, safeTemplates);
                    const isYearly = subscription.period === 'yearly';

                    const nextRenewal = getNextRenewal(subscription, todayForFiltering);
                    const todayStart = new Date(todayForFiltering.getFullYear(), todayForFiltering.getMonth(), todayForFiltering.getDate());
                    const daysUntil = Math.round((nextRenewal - todayStart) / 86400000);
                    const daysLabel = daysUntil === 0 ? 'Bugün' : daysUntil === 1 ? 'Yarın' : `${daysUntil} gün kaldı`;
                    const daysColor = daysUntil <= 2 ? theme.danger : daysUntil <= 7 ? theme.warning : theme.accent;

                    const cycleKey = getCycleKey(subscription, todayForFiltering);
                    const isPaid = subscription.paidCycleKey === cycleKey;

                    return (
                      <View key={subscription.id} style={[styles.subscriptionCard, styles.elevatedSurface, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.88) : theme.cardBg, borderColor: theme.cardBorder }] }>
                        <View style={styles.subscriptionMain}>
                          <View style={[styles.serviceIcon, { backgroundColor: serviceColor }]}>
                            <Text style={styles.serviceIconText}>{subscription.name?.charAt(0)?.toUpperCase() || 'C'}</Text>
                          </View>

                          <View style={styles.subscriptionInfo}>
                            <View style={styles.subscriptionTitleRow}>
                              <Text style={[styles.subscriptionName, { color: theme.textPrimary }]}>{subscription.name}</Text>

                              <View style={[styles.remainingDaysBadge, { backgroundColor: hexToRgba(daysColor, 0.14), borderColor: daysColor }]}>
                                <Text style={[styles.remainingDaysText, { color: daysColor }]}>⏳ {daysLabel}</Text>
                              </View>

                              <View style={[styles.informationTag, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                                <Text style={[styles.informationTagText, { color: theme.textSecondary }]}>💳 {subscription.paymentMethod}</Text>
                              </View>

                              {notificationOption.value !== -1 && notificationsEnabled && (
                                <View style={[styles.informationTag, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                                  <Text style={[styles.informationTagText, { color: theme.accent }]}>{notificationOption.badgeLabel}</Text>
                                </View>
                              )}

                              {(Number(subscription.annualIncreaseRate) || 0) > 0 && (
                                <View style={[styles.informationTag, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
                                  <Text style={[styles.informationTagText, { color: theme.accent }]}>↗ Yıllık Artış: %{Number(subscription.annualIncreaseRate).toFixed(1)}</Text>
                                </View>
                              )}

                              {subscription.category === 'Kredi' && getCreditSchedule(subscription) && (
                                <View style={[styles.informationTag, { backgroundColor: hexToRgba(CATEGORY_COLORS.Kredi, 0.12), borderColor: CATEGORY_COLORS.Kredi }]}>
                                  <Text style={[styles.informationTagText, { color: CATEGORY_COLORS.Kredi }]}>💳 {getCreditSchedule(subscription).installmentCount} {t('Taksit', language)} · {t('Bitiş', language)} {getMonthName(getCreditSchedule(subscription).endMonth - 1, language)} {getCreditSchedule(subscription).endYear}</Text>
                                </View>
                              )}
                            </View>

                            <Text style={[styles.subscriptionSubtitle, { color: theme.textSecondary }]}>
                              {subscription.category === 'Kredi' && getCreditSchedule(subscription)
                                ? `Kredi • Her Ayın ${subscription.billingDay}. Günü • ${getCreditSchedule(subscription).installmentCount} Taksit`
                                : `${subscription.category} • ${isYearly ? `${subscription.billingDay}/${subscription.billingMonth}/${subscription.billingYear}` : `Her Ayın ${subscription.billingDay}. Günü`}`}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.subscriptionRight}>
                          <Text style={[styles.subscriptionPrice, { color: theme.textPrimary }]}>{formatCurrencyWithPeriod(subscription.price, subscription.currency || 'TRY', isYearly ? 'year' : 'month', language)}</Text>
                          {subscription.currency !== 'TRY' && <Text style={[styles.convertedPrice, { color: theme.accent }]}>≈ {formatCurrency(priceInTL, 'TRY')}</Text>}

                          <View style={styles.subscriptionActions}>
                            <TouchableOpacity style={[styles.smallActionButton, { backgroundColor: isPaid ? theme.success : theme.inputBg, borderColor: isPaid ? theme.success : theme.cardBorder }]} onPress={() => togglePaid(subscription)}>
                              <Text style={[styles.smallActionText, { color: isPaid ? '#04331f' : theme.textSecondary }]}>{isPaid ? '✓ Ödendi' : 'Ödendi İşaretle'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.smallActionButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => openSubscriptionForm(subscription)}>
                              <Text style={[styles.smallActionText, { color: theme.textSecondary }]}>Düzenle</Text>
                            </TouchableOpacity>

                            {subscription.cancelUrl ? (
                              <TouchableOpacity style={[styles.smallActionButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => Linking.openURL(subscription.cancelUrl)}>
                                <Text style={[styles.smallActionText, { color: theme.accent }]}>Yönet</Text>
                              </TouchableOpacity>
                            ) : null}

                            <TouchableOpacity style={[styles.deleteButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => handleDeleteSubscription(subscription.id)}>
                              <Text style={styles.deleteButtonText}>🗑️</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })
                )}
              </>
            )}

            {activeTab === 'calendar' && (
              <View style={styles.calendarSection}>
                <View style={styles.calendarNavigation}>
                  <TouchableOpacity style={[styles.calendarNavigationButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => {
                    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(Math.max(YEARS[0], calendarYear - 1)); } else setCalendarMonth(calendarMonth - 1);
                  }}>
                    <Text style={[styles.calendarNavigationText, { color: theme.accent }]}>◀ Önceki</Text>
                  </TouchableOpacity>

                  <Text style={[styles.calendarTitle, { color: theme.textPrimary }]}>{getMonthName(calendarMonth, language)} {calendarYear}</Text>

                  <TouchableOpacity style={[styles.calendarNavigationButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => {
                    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(Math.min(YEARS[YEARS.length - 1], calendarYear + 1)); } else setCalendarMonth(calendarMonth + 1);
                  }}>
                    <Text style={[styles.calendarNavigationText, { color: theme.accent }]}>Sonraki ▶</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.calendarYearSelectorRow}>
                  <Text style={[styles.calendarYearSelectorLabel, { color: theme.textMuted }]}>Takvim Yılı</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.calendarYearSelectButton, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
                    onPress={() => setIsCalendarYearPickerOpen(true)}
                  >
                    <Text style={[styles.calendarYearSelectValue, { color: theme.textPrimary }]}>{calendarYear}</Text>
                    <Text style={[styles.yearSelectChevron, { color: theme.accent }]}>⌄</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.calendarContainer, styles.elevatedSurface, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.88) : theme.cardBg }]}>
                  <View style={styles.calendarWeekHeader}>
                    {getWeekdayShortNames(language).map(dayName => (
                      <View key={dayName} style={styles.calendarWeekDay}>
                        <Text style={[styles.calendarWeekDayText, { color: theme.textSecondary }]}>{dayName}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.calendarGrid}>
                    {Array.from({ length: firstDayOffset }).map((_, i) => (
                      <View key={`empty-${i}`} style={[styles.calendarDay, styles.calendarDayEmpty]} />
                    ))}

                    {Array.from({ length: daysInCurrentMonth }).map((_, dayIndex) => {
                      const dayNumber = dayIndex + 1;
                      const subscriptionsForDay = safeList.filter(subscription => {
                        if (subscription.status === 'cancelled') return false;
                        const targetMonthKey = calendarYear * 12 + calendarMonth;
                        const creditSchedule = getCreditSchedule(subscription);
                        if (creditSchedule) {
                          if (targetMonthKey < creditSchedule.startMonthKey || targetMonthKey > creditSchedule.endMonthKey) return false;
                          return Number(subscription.billingDay) === dayNumber;
                        }

                        const billingMonthKey = (Number(subscription.billingYear) || calendarYear) * 12 + ((Number(subscription.billingMonth) || 1) - 1);
                        if (targetMonthKey < billingMonthKey) return false;
                        if (subscription.period === 'monthly') return Number(subscription.billingDay) === dayNumber;
                        return Number(subscription.billingDay) === dayNumber && Number(subscription.billingMonth) === calendarMonth + 1;
                      });

                      const hasSubscription = subscriptionsForDay.length > 0;

                      return (
                        <TouchableOpacity
                          key={dayNumber}
                          activeOpacity={0.75}
                          onPress={() => openDayDrawer(dayNumber, subscriptionsForDay)}
                          style={[styles.calendarDay, { backgroundColor: theme.cardBg, borderColor: hasSubscription ? theme.activeButtonBorder : theme.cardBorder }, hasSubscription && styles.calendarDayActive]}
                        >
                          <Text style={[styles.calendarDayNumber, { color: theme.textPrimary }]}>{dayNumber}</Text>

                          <ScrollView style={styles.calendarDayScroll} contentContainerStyle={styles.calendarDayScrollContent} nestedScrollEnabled showsVerticalScrollIndicator={subscriptionsForDay.length > 3}>
                            {subscriptionsForDay.map(subscription => {
                              const badgeColor = subscription.color || CATEGORY_COLORS[subscription.category] || CATEGORY_COLORS.Diğer;
                              return (
                                <View key={subscription.id} style={[styles.calendarSubscriptionBadge, { backgroundColor: badgeColor }]}>
                                  <Text style={styles.calendarSubscriptionName} numberOfLines={1}>{subscription.name}</Text>
                                  <Text style={styles.calendarSubscriptionPrice}>{formatShortCurrency(getSubscriptionCostForMonth(subscription, calendarYear, calendarMonth, exchangeRates), 'TRY')}</Text>
                                </View>
                              );
                            })}
                          </ScrollView>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'analytics' && (
              <View style={styles.analyticsSection}>
                <View style={styles.analysisToolbar}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[styles.analysisToolbarLabel, { color: theme.textMuted }]}>Raporlama Dönemi</Text>
                    <Text style={[styles.analysisToolbarHint, { color: theme.textSecondary }]}>Tüm Analizler Seçilen Yıla Göre Güncellenir</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.yearSelectButton, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
                    onPress={() => setIsAnalysisYearPickerOpen(true)}
                  >
                    <View>
                      <Text style={[styles.yearSelectCaption, { color: theme.textMuted }]}>Yıl</Text>
                      <Text style={[styles.yearSelectValue, { color: theme.textPrimary }]}>{selectedAnalysisYear}</Text>
                    </View>
                    <Text style={[styles.yearSelectChevron, { color: theme.accent }]}>⌄</Text>
                  </TouchableOpacity>
                </View>

                <View style={[
                  styles.insightBox,
                  {
                    backgroundColor: hasHighCreditLoad ? hexToRgba(theme.warning, 0.16) : theme.summaryBg,
                    borderColor: hasHighCreditLoad ? hexToRgba(theme.warning, 0.72) : theme.summaryBorder,
                    ...(Platform.OS === 'web'
                      ? {
                          backgroundImage: hasHighCreditLoad
                            ? `linear-gradient(135deg, ${hexToRgba(theme.warning, 0.18)}, ${hexToRgba(theme.danger, 0.14)})`
                            : `linear-gradient(135deg, ${theme.summaryBg}, ${theme.activeButton})`
                        }
                      : {})
                  }
                ]}>
                  <View style={[styles.insightIconBox, hasHighCreditLoad && { backgroundColor: hexToRgba(theme.warning, 0.18), borderColor: hexToRgba(theme.warning, 0.42), borderWidth: 1 }]}>
                    <Text style={{ fontSize: 20 }}>{hasHighCreditLoad ? '⚠️' : '✨'}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[styles.insightTitle, hasHighCreditLoad && { color: theme.warning }]}>Akıllı Asistan Özeti</Text>
                    <Text style={[styles.insightText, hasHighCreditLoad && { color: theme.textPrimary }]}>{formatUiDescription(insightText, language)}</Text>
                  </View>
                </View>

                <View style={[styles.panel, styles.analysisPrimaryPanel, styles.elevatedSurface, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.88) : theme.cardBg, borderColor: theme.cardBorder }] }>
                  <View style={styles.analysisPanelHeader}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={[styles.panelTitle, { color: theme.textPrimary }]}>{selectedAnalysisYear} {t('Aylık Ortalama Maliyet Grafiği', language)}</Text>
                      <Text style={[styles.panelDescription, { color: theme.textMuted }]}>
                        {analyticsIncludeCredits
                          ? 'Toplam Finansal Yük: Abonelikler Ve Aktif Kredi Taksitleri Birlikte Gösterilir'
                          : 'Sabit Abonelikler: Kredi Taksitleri Ölçekten Ayrılarak Küçük Giderler Daha Net Görünür'}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.analyticsSegmentedControl, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: !analyticsIncludeCredits }}
                      onPress={() => { setAnalyticsIncludeCredits(false); setSelectedChartMonthIndex(null); }}
                      style={({ hovered, pressed }) => [
                        styles.analyticsSegmentButton,
                        !analyticsIncludeCredits && { backgroundColor: theme.activeButton, borderColor: theme.activeButtonBorder },
                        (hovered || pressed) && styles.analyticsSegmentButtonInteractive
                      ]}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.analyticsSegmentText,
                          { color: !analyticsIncludeCredits ? '#ffffff' : theme.textSecondary }
                        ]}
                      >
                        Sabit Abonelikler
                      </Text>
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: analyticsIncludeCredits }}
                      onPress={() => { setAnalyticsIncludeCredits(true); setSelectedChartMonthIndex(null); }}
                      style={({ hovered, pressed }) => [
                        styles.analyticsSegmentButton,
                        analyticsIncludeCredits && { backgroundColor: hexToRgba(CATEGORY_COLORS.Kredi, 0.18), borderColor: CATEGORY_COLORS.Kredi },
                        (hovered || pressed) && styles.analyticsSegmentButtonInteractive
                      ]}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.analyticsSegmentText,
                          { color: analyticsIncludeCredits ? CATEGORY_COLORS.Kredi : theme.textSecondary }
                        ]}
                      >
                        Toplam Finansal Yük
                      </Text>
                    </Pressable>
                  </View>

                  <View style={styles.categoryLegend}>
                    {Object.entries(CATEGORY_COLORS).filter(([category]) => analyticsIncludeCredits || category !== 'Kredi').map(([category, color]) => (
                      <View key={category} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: color }]} />
                        <Text style={[styles.legendText, { color: theme.textSecondary }]}>{category}</Text>
                      </View>
                    ))}
                  </View>

                  {selectedChartMonthIndex !== null && (
                    <View style={[styles.chartPopover, { backgroundColor: theme.inputBg, borderColor: theme.activeButtonBorder }]}>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={[styles.chartPopoverMonth, { color: theme.textPrimary }]}>
                          {getMonthName(selectedChartMonthIndex, language)} {selectedAnalysisYear}
                        </Text>
                        <Text style={[styles.chartPopoverHint, { color: theme.textMuted }]}>
                          {t('Aylık Ortalama Maliyet', language)} · {analyticsIncludeCredits ? t('Toplam Finansal Yük', language) : t('Sabit Abonelikler', language)}
                        </Text>
                      </View>
                      <Text style={[styles.chartPopoverAmount, { color: theme.accent }]}>
                        {formatCurrency(monthlyTotals[selectedChartMonthIndex] || 0, 'TRY')}
                      </Text>
                    </View>
                  )}

                  <ScrollView
                    horizontal={isMobile}
                    scrollEnabled={isMobile}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chartScrollContent}
                  >
                    <View style={styles.chartArea}>
                      {monthlyTotals.map((monthTotal, monthIndex) => {
                        const heightPercentage = maxMonthlyExpense > 0 ? (monthTotal / maxMonthlyExpense) * 100 : 0;
                        const visibleHeight = monthTotal > 0 ? Math.max(heightPercentage, 8) : 0;
                        const categorySegments = monthlyCategoryBreakdown[monthIndex] || [];
                        const isSelectedMonth = selectedChartMonthIndex === monthIndex;

                        return (
                          <Pressable
                            key={monthIndex}
                            accessibilityRole="button"
                            accessibilityLabel={`${getMonthName(monthIndex, language)} ${selectedAnalysisYear}: ${formatCurrency(monthTotal, 'TRY')}`}
                            onPress={() => setSelectedChartMonthIndex(current => current === monthIndex ? null : monthIndex)}
                            onHoverIn={() => { if (Platform.OS === 'web') setSelectedChartMonthIndex(monthIndex); }}
                            style={({ pressed }) => [styles.chartColumn, pressed && styles.chartColumnPressed]}
                          >
                            {!isMobile && (
                              <Text style={[styles.chartAmount, { color: isSelectedMonth ? theme.accent : theme.textSecondary }]} numberOfLines={1}>
                                {monthTotal > 0 ? formatCompactCurrency(monthTotal, 'TRY') : ''}
                              </Text>
                            )}

                            <View
                              style={[
                                styles.chartTrack,
                                {
                                  backgroundColor: theme.inputBg,
                                  borderColor: isSelectedMonth ? theme.activeButtonBorder : theme.cardBorder
                                },
                                isSelectedMonth && styles.chartTrackSelected
                              ]}
                            >
                              {monthTotal > 0 && (
                                <View style={[styles.chartStack, { height: `${visibleHeight}%` }]}>
                                  {categorySegments.map((segment, segmentIndex) => (
                                    <View
                                      key={`${segment.category}-${segmentIndex}`}
                                      style={[
                                        styles.chartSegment,
                                        {
                                          height: `${(segment.amount / monthTotal) * 100}%`,
                                          backgroundColor: segment.color,
                                          ...(Platform.OS === 'web' ? { backgroundImage: `linear-gradient(180deg, ${lightenHex(segment.color, 22)} 0%, ${segment.color} 100%)` } : {})
                                        }
                                      ]}
                                    />
                                  ))}
                                </View>
                              )}
                            </View>

                            <Text style={[styles.chartMonthLabel, { color: isSelectedMonth ? theme.accent : theme.textPrimary }]}>
                              {getMonthName(monthIndex, language).substring(0, 3)}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </ScrollView>

                  <Text style={[styles.chartInteractionHint, { color: theme.textMuted }]}>
                    {isMobile ? 'Detay İçin Bir Aya Dokunun Grafiği Yatay Kaydırabilirsiniz' : 'Detay İçin Çubukların Üzerine Gelin Veya Tıklayın'}
                  </Text>

                  <View style={[styles.chartFooter, { borderTopColor: theme.cardBorder }]}>
                    <Text style={[styles.chartFooterLabel, { color: theme.textPrimary }]}>{t('Aylık Ortalama Maliyet', language)} ({selectedAnalysisYear})</Text>
                    <Text style={[styles.chartFooterValue, { color: theme.accent }]}>{formatMonthlyMetric(averageMonthlyExpense, null, 'TRY', language)}</Text>
                  </View>
                </View>

                <View style={[styles.analysisSectionCard, styles.elevatedSurface, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.88) : theme.cardBg, borderColor: theme.cardBorder }] }>
                  <View style={styles.distributionSectionHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.distributionTitle, styles.distributionTitleNoTop, { color: theme.textPrimary }]}>Ödeme Yöntemine Göre Aylık Dağılım</Text>
                      <Text style={[styles.distributionSubtitle, { color: theme.textMuted }]}>Kart Ve Hesap Bazında Aylık Ödeme Yükü</Text>
                    </View>
                    <View style={[styles.monthlyCommitmentBadge, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
                      <Text style={[styles.monthlyCommitmentBadgeLabel, { color: theme.textMuted }]}>Aylık Toplam</Text>
                      <Text style={[styles.monthlyCommitmentBadgeValue, { color: theme.textPrimary }]}>{formatMonthlyMetric(totalMonthlyPaymentCommitment, null, 'TRY', language)}</Text>
                    </View>
                  </View>

                  {sortedMonthlyPaymentMethodEntries.length === 0 ? (
                    <View style={[styles.emptyCard, styles.elevatedSurface, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.88) : theme.cardBg, borderColor: theme.cardBorder }] }>
                      <Text style={styles.emptyIcon}>💳</Text>
                      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Aylık Ödeme Yükü Bulunamadı</Text>
                      <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>Aktif Bir Abonelik Eklediğinizde Aylık Dağılım Burada Görünür</Text>
                    </View>
                  ) : (
                    <View style={styles.monthlyPaymentGrid}>
                      {sortedMonthlyPaymentMethodEntries.map(([paymentMethod, amount]) => {
                        const percentage = totalMonthlyPaymentCommitment > 0 ? (amount / totalMonthlyPaymentCommitment) * 100 : 0;
                        return (
                          <View key={`monthly-${paymentMethod}`} style={[styles.monthlyPaymentCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                            <View style={[styles.monthlyPaymentIcon, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
                              <Text style={styles.monthlyPaymentIconText}>💳</Text>
                            </View>
                            <View style={styles.monthlyPaymentContent}>
                              <Text style={[styles.monthlyPaymentName, { color: theme.textPrimary }]} numberOfLines={1}>{paymentMethod}</Text>
                              <Text style={[styles.monthlyPaymentMeta, { color: theme.textMuted }]}>Aylık Bütçe Dağılımı</Text>
                              <View style={[styles.progressTrack, { backgroundColor: theme.inputBg, marginTop: 8 }]}>
                                <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: theme.accent }]} />
                              </View>
                            </View>
                            <Text style={[styles.monthlyPaymentAmount, { color: theme.textPrimary }]}>{formatMonthlyMetric(amount, percentage, 'TRY', language)}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>

                <View style={[styles.analysisSectionCard, styles.elevatedSurface, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.88) : theme.cardBg, borderColor: theme.cardBorder }] }>
                  <Text style={[styles.distributionTitle, styles.distributionTitleNoTop, { color: theme.textPrimary }]}>Kategori Bazlı Aylık Dağılım</Text>
                  {sortedMonthlyCategoryEntries.length === 0 ? (
                    <Text style={[styles.noDataText, { color: theme.textSecondary }]}>Seçilen Yıl İçin Kategori Verisi Bulunamadı</Text>
                  ) : sortedMonthlyCategoryEntries.map(([category, amount]) => {
                    const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.Diğer;
                    const percentage = totalMonthlyCategoryExpense > 0 ? ((amount / totalMonthlyCategoryExpense) * 100).toFixed(1) : 0;
                    return (
                      <View key={category} style={[styles.distributionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                        <View style={styles.distributionHeader}>
                          <View style={styles.distributionNameGroup}>
                            <View style={[styles.distributionColorDot, { backgroundColor: categoryColor }]} />
                            <Text style={[styles.distributionName, { color: theme.textPrimary }]}>{category}</Text>
                          </View>
                          <Text style={[styles.distributionAmount, { color: theme.textPrimary }]}>{formatMonthlyMetric(amount, percentage, 'TRY', language)}</Text>
                        </View>
                        <View style={[styles.progressTrack, { backgroundColor: theme.inputBg }]}>
                          <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: categoryColor }]} />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          {!isDesktop && (
            <View style={[styles.bottomNavigation, { backgroundColor: theme.headerBg, borderTopColor: theme.cardBorder }]}>
              {[
                { key: 'list', icon: '💳', label: 'Abonelikler', onPress: () => handleTabChange('list') },
                { key: 'calendar', icon: '📅', label: 'Takvim', onPress: () => handleTabChange('calendar') },
                { key: 'analytics', icon: '📊', label: 'Analiz', onPress: () => handleTabChange('analytics') },
                { key: 'settings', icon: '⚙️', label: 'Ayarlar', onPress: openUserSettings },
                { key: 'logout', icon: '↪', label: 'Çıkış', onPress: handleLogout }
              ].map(navItem => {
                const isActiveMobileTab = ['list', 'calendar', 'analytics'].includes(navItem.key) && activeTab === navItem.key;
                const isLogoutItem = navItem.key === 'logout';
                return (
                  <TouchableOpacity key={navItem.key} style={styles.bottomNavigationItem} onPress={navItem.onPress}>
                    <Text style={[styles.bottomNavigationIcon, isLogoutItem && { color: theme.danger }]}>{navItem.icon}</Text>
                    <Text
                      style={[
                        styles.bottomNavigationText,
                        { color: isLogoutItem ? theme.danger : isActiveMobileTab ? '#9b98ff' : theme.textSecondary }
                      ]}
                    >
                      {navItem.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>

      <Modal visible={dayDrawer.visible} transparent animationType="slide" onRequestClose={() => setDayDrawer(d => ({ ...d, visible: false }))}>
        <View style={styles.drawerOverlay}>
          <TouchableOpacity style={styles.drawerBackdrop} activeOpacity={1} onPress={() => setDayDrawer(d => ({ ...d, visible: false }))} />
          <View style={[styles.dayDrawerPanel, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.94) : theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{dayDrawer.day} {dayDrawer.month !== null ? getMonthName(dayDrawer.month, language) : ''} {dayDrawer.year}</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Bu Güne Ait Ödemeler</Text>
              </View>
              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg }]} onPress={() => setDayDrawer(d => ({ ...d, visible: false }))}>
                <RemoveXIcon color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
              {(dayDrawer.items || []).length === 0 ? (
                <View style={[styles.emptyCard, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, marginTop: 6 }]}>
                  <Text style={styles.emptyIcon}>📭</Text>
                  <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Bu Gün İçin Ödeme Yok</Text>
                </View>
              ) : (dayDrawer.items || []).map(sub => (
                <View key={sub.id} style={[styles.subscriptionCard, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, marginBottom: 10 }]}>
                  <View style={styles.subscriptionMain}>
                    <View style={[styles.serviceIcon, { backgroundColor: sub.color || getServiceColor(sub.name, safeTemplates) }]}>
                      <Text style={styles.serviceIconText}>{sub.name?.charAt(0)?.toUpperCase() || 'C'}</Text>
                    </View>
                    <View style={styles.subscriptionInfo}>
                      <Text style={[styles.subscriptionName, { color: theme.textPrimary }]}>{sub.name}</Text>
                      <Text style={[styles.subscriptionSubtitle, { color: theme.textSecondary }]}>{sub.category} • {sub.paymentMethod}</Text>
                    </View>
                  </View>
                  <Text style={[styles.subscriptionPrice, { color: theme.textPrimary }]}>{formatCurrency(getSubscriptionCostForMonth(sub, dayDrawer.year, dayDrawer.month, exchangeRates), 'TRY')}</Text>
                </View>
              ))}
            </ScrollView>

            {(dayDrawer.items || []).length > 0 && (
              <View style={[styles.chartFooter, { borderTopColor: theme.cardBorder, marginHorizontal: 20, marginBottom: 18 }]}>
                <Text style={[styles.chartFooterLabel, { color: theme.textPrimary }]}>Toplam</Text>
                <Text style={[styles.chartFooterValue, { color: theme.accent }]}>
                  {formatCurrency((dayDrawer.items || []).reduce((t, s) => t + getSubscriptionCostForMonth(s, dayDrawer.year, dayDrawer.month, exchangeRates), 0), 'TRY')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={isDashboardYearPickerOpen} transparent animationType="fade" onRequestClose={() => setIsDashboardYearPickerOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.yearPickerBackdrop} activeOpacity={1} onPress={() => setIsDashboardYearPickerOpen(false)} />
          <View style={[styles.yearPickerCard, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.96) : theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.yearPickerHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Ana Panel Bütçe Yılı</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Özet Maliyetlerin Hesaplanacağı Projeksiyon Yılını Seçin</Text>
              </View>
              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg }]} onPress={() => setIsDashboardYearPickerOpen(false)}>
                <RemoveXIcon color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.yearPickerGrid}>
              {YEARS.map(year => {
                const isSelected = selectedDashboardYear === year;
                return (
                  <TouchableOpacity
                    key={`dashboard-picker-${year}`}
                    style={[styles.yearPickerOption, { backgroundColor: isSelected ? theme.activeButton : theme.inputBg, borderColor: isSelected ? theme.activeButtonBorder : theme.cardBorder }]}
                    onPress={() => { setSelectedDashboardYear(year); setSelectedAnalysisYear(year); setIsDashboardYearPickerOpen(false); }}
                  >
                    <Text style={[styles.yearPickerOptionText, { color: isSelected ? '#ffffff' : theme.textPrimary }]}>{year}</Text>
                    {isSelected && <Text style={styles.yearPickerCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isCalendarYearPickerOpen} transparent animationType="fade" onRequestClose={() => setIsCalendarYearPickerOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.yearPickerBackdrop} activeOpacity={1} onPress={() => setIsCalendarYearPickerOpen(false)} />
          <View style={[styles.yearPickerCard, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.96) : theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.yearPickerHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Takvim Yılı</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Ödeme Takviminde Görüntülenecek Yılı Seçin</Text>
              </View>
              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg }]} onPress={() => setIsCalendarYearPickerOpen(false)}>
                <RemoveXIcon color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.yearPickerGrid}>
              {YEARS.map(year => {
                const isSelected = calendarYear === year;
                return (
                  <TouchableOpacity
                    key={`calendar-picker-${year}`}
                    style={[styles.yearPickerOption, { backgroundColor: isSelected ? theme.activeButton : theme.inputBg, borderColor: isSelected ? theme.activeButtonBorder : theme.cardBorder }]}
                    onPress={() => { setCalendarYear(year); setIsCalendarYearPickerOpen(false); }}
                  >
                    <Text style={[styles.yearPickerOptionText, { color: isSelected ? '#ffffff' : theme.textPrimary }]}>{year}</Text>
                    {isSelected && <Text style={styles.yearPickerCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isAnalysisYearPickerOpen} transparent animationType="fade" onRequestClose={() => setIsAnalysisYearPickerOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.yearPickerBackdrop} activeOpacity={1} onPress={() => setIsAnalysisYearPickerOpen(false)} />
          <View style={[styles.yearPickerCard, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.96) : theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.yearPickerHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Raporlama Yılı</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Finansal Analizlerin Gösterileceği Yılı Seçin</Text>
              </View>
              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg }]} onPress={() => setIsAnalysisYearPickerOpen(false)}>
                <RemoveXIcon color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.yearPickerGrid}>
              {YEARS.map(year => {
                const isSelected = selectedAnalysisYear === year;
                return (
                  <TouchableOpacity
                    key={`picker-${year}`}
                    style={[styles.yearPickerOption, { backgroundColor: isSelected ? theme.activeButton : theme.inputBg, borderColor: isSelected ? theme.activeButtonBorder : theme.cardBorder }]}
                    onPress={() => { handleAnalysisYearChange(year); setIsAnalysisYearPickerOpen(false); }}
                  >
                    <Text style={[styles.yearPickerOptionText, { color: isSelected ? '#ffffff' : theme.textPrimary }]}>{year}</Text>
                    {isSelected && <Text style={styles.yearPickerCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isUserSettingsOpen} transparent animationType="fade" onRequestClose={() => setIsUserSettingsOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.settingsBackdrop} activeOpacity={1} onPress={() => setIsUserSettingsOpen(false)} />
          <View style={[styles.userSettingsModal, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.96) : theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Kullanıcı Ayarları</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Hesap Bilgilerinizi Görüntüleyin Ve Şifrenizi Güvenli Şekilde Güncelleyin</Text>
              </View>
              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg }]} onPress={() => setIsUserSettingsOpen(false)}>
                <RemoveXIcon color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.userSettingsScroll} contentContainerStyle={styles.userSettingsContent} showsVerticalScrollIndicator>
              <View style={[styles.settingsInfoCard, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Hesap Bilgileri</Text>
                <View style={styles.settingsInfoRow}>
                  <Text style={[styles.settingsInfoLabel, { color: theme.textMuted }]}>Kullanıcı Adı</Text>
                  <Text style={[styles.settingsInfoValue, { color: theme.textPrimary }]}>{currentUserProfile.username || '-'}</Text>
                </View>
                <View style={styles.settingsInfoRow}>
                  <Text style={[styles.settingsInfoLabel, { color: theme.textMuted }]}>E-posta</Text>
                  <Text style={[styles.settingsInfoValue, { color: theme.textPrimary }]}>{currentUserProfile.email || auth.currentUser?.email || '-'}</Text>
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Şifremi Değiştir</Text>
                <Text style={[styles.formSectionDescription, { color: theme.textMuted }]}>Güvenlik Nedeniyle Önce Mevcut Şifreniz Doğrulanır</Text>

                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Mevcut Şifre</Text>
                <View style={[styles.passwordInputShell, { backgroundColor: theme.inputBg, borderColor: passwordErrors.current ? theme.danger : theme.cardBorder }]}>
                  <TextInput
                    style={[styles.passwordTextInput, { color: theme.textPrimary }]}
                    secureTextEntry={!currentPasswordVisible}
                    value={currentPassword}
                    onChangeText={value => { setCurrentPassword(value); setPasswordErrors(current => ({ ...current, current: '', general: '' })); }}
                    placeholder="Mevcut şifreniz"
                    placeholderTextColor={theme.textMuted}
                  />
                  <Pressable style={({ hovered, pressed }) => [styles.eyeButton, (hovered || pressed) && styles.eyeButtonHover]} onPress={() => setCurrentPasswordVisible(value => !value)}>
                    <PasswordEyeIcon visible={currentPasswordVisible} color={theme.accent} />
                  </Pressable>
                </View>
                {!!passwordErrors.current && <Text style={[styles.fieldErrorText, { color: theme.danger }]}>{passwordErrors.current}</Text>}

                <View style={[styles.twoColumnRow, isMobile && styles.singleColumnRow]}>
                  <View style={styles.formColumn}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Yeni Şifre</Text>
                    <View style={[styles.passwordInputShell, { backgroundColor: theme.inputBg, borderColor: passwordErrors.next ? theme.danger : theme.cardBorder }]}>
                      <TextInput
                        style={[styles.passwordTextInput, { color: theme.textPrimary }]}
                        secureTextEntry={!newPasswordVisible}
                        value={newPassword}
                        onChangeText={value => { setNewPassword(value); setPasswordErrors(current => ({ ...current, next: '', confirm: current.confirm && value === newPasswordConfirm ? '' : current.confirm, general: '' })); }}
                        placeholder="En az 6 karakter"
                        placeholderTextColor={theme.textMuted}
                      />
                      <Pressable style={({ hovered, pressed }) => [styles.eyeButton, (hovered || pressed) && styles.eyeButtonHover]} onPress={() => setNewPasswordVisible(value => !value)}>
                        <PasswordEyeIcon visible={newPasswordVisible} color={theme.accent} />
                      </Pressable>
                    </View>
                    {!!passwordErrors.next && <Text style={[styles.fieldErrorText, { color: theme.danger }]}>{passwordErrors.next}</Text>}
                  </View>

                  <View style={styles.formColumn}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Yeni Şifre Tekrarı</Text>
                    <View style={[styles.passwordInputShell, { backgroundColor: theme.inputBg, borderColor: passwordErrors.confirm ? theme.danger : theme.cardBorder }]}>
                      <TextInput
                        style={[styles.passwordTextInput, { color: theme.textPrimary }]}
                        secureTextEntry={!newPasswordConfirmVisible}
                        value={newPasswordConfirm}
                        onChangeText={value => { setNewPasswordConfirm(value); setPasswordErrors(current => ({ ...current, confirm: value && value !== newPassword ? 'Şifreler uyuşmuyor.' : '', general: '' })); }}
                        onBlur={() => { if (newPasswordConfirm && newPasswordConfirm !== newPassword) showToast('Şifreler uyuşmuyor.', 'error'); }}
                        placeholder="Yeni şifreyi tekrar giriniz"
                        placeholderTextColor={theme.textMuted}
                      />
                      <Pressable style={({ hovered, pressed }) => [styles.eyeButton, (hovered || pressed) && styles.eyeButtonHover]} onPress={() => setNewPasswordConfirmVisible(value => !value)}>
                        <PasswordEyeIcon visible={newPasswordConfirmVisible} color={theme.accent} />
                      </Pressable>
                    </View>
                    {!!passwordErrors.confirm && <Text style={[styles.fieldErrorText, { color: theme.danger }]}>{passwordErrors.confirm}</Text>}
                  </View>
                </View>

                {!!passwordErrors.general && <Text style={[styles.settingsGeneralError, { color: theme.danger, backgroundColor: hexToRgba(theme.danger, 0.10), borderColor: hexToRgba(theme.danger, 0.35) }]}>{passwordErrors.general}</Text>}
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: theme.cardBorder }]}>
              <Pressable style={({ hovered, pressed }) => [styles.modalCancelButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, (hovered || pressed) && styles.premiumButtonHover]} onPress={() => setIsUserSettingsOpen(false)}>
                <Text style={[styles.modalCancelButtonText, { color: theme.textSecondary }]}>Kapat</Text>
              </Pressable>
              <Pressable style={({ hovered, pressed }) => [styles.modalSaveButton, isPasswordUpdating && { opacity: 0.65 }, (hovered || pressed) && !isPasswordUpdating && styles.premiumButtonHover]} disabled={isPasswordUpdating} onPress={handleChangePassword}>
                <Text style={styles.modalSaveButtonText}>{isPasswordUpdating ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isAppearanceModalOpen} transparent animationType="fade" onRequestClose={() => setIsAppearanceModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.appearanceModal, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Görünüm Ayarları</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Arka Plan Temasını Ve Yazı Boyutunu Kişiselleştirin</Text>
              </View>
              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg }]} onPress={() => setIsAppearanceModalOpen(false)}>
                <RemoveXIcon color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator contentContainerStyle={{ paddingBottom: 8 }}>
              <Text style={[styles.appearanceSectionTitle, { color: theme.textPrimary }]}>Arka Plan Teması</Text>
              <View style={styles.appearanceOptionGrid}>
                {Object.entries(BACKGROUND_PRESETS).map(([presetKey, preset]) => (
                  <TouchableOpacity key={presetKey} style={[styles.appearanceThemeOption, { backgroundColor: preset.cardBg, borderColor: backgroundPreset === presetKey ? theme.activeButtonBorder : preset.cardBorder }, backgroundPreset === presetKey && styles.appearanceOptionActive]} onPress={() => setBackgroundPreset(presetKey)}>
                    <View style={[styles.themePreview, { backgroundColor: preset.bg }]}>
                      <View style={[styles.themePreviewSidebar, { backgroundColor: preset.sidebarBg }]} />
                      <View style={styles.themePreviewContent}>
                        <View style={[styles.themePreviewHeader, { backgroundColor: preset.headerBg }]} />
                        <View style={[styles.themePreviewCard, { backgroundColor: preset.summaryBg }]} />
                      </View>
                    </View>
                    <Text style={[styles.appearanceOptionLabel, { color: preset.textPrimary }]}>{preset.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.appearanceSectionTitle, { color: theme.textPrimary }]}>Yazı Boyutu</Text>
              <View style={styles.fontScaleRow}>
                {FONT_SCALE_OPTIONS.map(option => (
                  <TouchableOpacity key={option.key} style={[styles.fontScaleOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, fontScaleKey === option.key && styles.fontScaleOptionActive]} onPress={() => setFontScaleKey(option.key)}>
                    <Text style={[styles.fontScaleOptionText, { color: theme.textSecondary, fontSize: 12 * option.scale }, fontScaleKey === option.key && styles.fontScaleOptionTextActive]}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setIsAppearanceModalOpen(false)}>
              <Text style={styles.primaryButtonText}>Ayarları Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isSubscriptionModalOpen} transparent animationType="fade" onRequestClose={closeSubscriptionForm}>
        <View style={styles.modalOverlay}>
          <View style={[styles.subscriptionModal, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{editingId ? 'Abonelik Düzenle' : 'Yeni Abonelik Ekle'}</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Abonelik Veya Sabit Gider Bilgilerini Girin</Text>

                <View style={styles.stepIndicatorRow}>
                  {[1, 2].map(step => (
                    <View key={step} style={[styles.stepDot, { backgroundColor: step <= formStep ? theme.activeButton : theme.inputBg }]} />
                  ))}
                  <Text style={[styles.stepIndicatorText, { color: theme.textMuted }]}>Adım {formStep} / 2</Text>
                </View>
              </View>

              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg }]} onPress={closeSubscriptionForm}>
                <RemoveXIcon color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView className="cebin-subscription-scroll" style={styles.subscriptionModalScroll} contentContainerStyle={styles.subscriptionModalContent} showsVerticalScrollIndicator>
              {formStep === 1 && (
                <>
                  {!editingId && (
                    <View style={styles.formSection}>
                      <View style={styles.formSectionHeader}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Hızlı Şablon Seç</Text>
                          <Text style={[styles.formSectionDescription, { color: theme.textMuted }]}>Hazır Bir Servis Seçerek Alanları Otomatik Doldurun</Text>
                        </View>
                        <TouchableOpacity onPress={() => setShowTemplateForm(!showTemplateForm)}>
                          <Text style={[styles.formSectionAction, { color: theme.accent }]}>{showTemplateForm ? 'Kapat' : '+ Şablon Ekle'}</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.removableOptionGrid}>
                        {safeTemplates.map((template, index) => (
                          <View key={`${template.name}-${index}`} style={styles.removableOptionWrapper}>
                            <TouchableOpacity
                              style={[styles.templateOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}
                              onPress={() => {
                                setFormName(template.name);
                                setFormPrice(template.price);
                                setFormCurrency(template.currency);
                                setFormCategory(template.category);
                                setFormColor(template.color);
                              }}
                            >
                              <View style={[styles.templateDot, { backgroundColor: template.color }]} />
                              <Text style={[styles.templateOptionText, { color: theme.textPrimary }]} numberOfLines={1}>{template.name}</Text>
                            </TouchableOpacity>
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`${template.name} şablonunu sil`}
                              hitSlop={6}
                              style={({ hovered, pressed }) => [
                                styles.removeOptionButton,
                                hovered && styles.removeOptionButtonHover,
                                pressed && styles.removeOptionButtonPressed
                              ]}
                              onPress={() => removeTemplate(index)}
                            >
                              <RemoveXIcon color={theme.textSecondary} />
                            </Pressable>
                          </View>
                        ))}
                      </View>

                      {showTemplateForm && (
                        <View style={[styles.inlineForm, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                          <TextInput style={[styles.textInput, { backgroundColor: theme.cardBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="Şablon Adı" placeholderTextColor={theme.textMuted} value={newTemplateName} onChangeText={setNewTemplateName} />
                          <View style={styles.inlineInputRow}>
                            <TextInput
                              style={[styles.textInput, styles.flexInput, { backgroundColor: theme.cardBg, color: theme.textPrimary, borderColor: theme.cardBorder }, focusedNumericInput === 'templatePrice' && styles.numericInputFocused]}
                              placeholder="Fiyat"
                              placeholderTextColor={theme.textMuted}
                              keyboardType="decimal-pad"
                              inputMode="decimal"
                              value={newTemplatePrice}
                              onFocus={() => setFocusedNumericInput('templatePrice')}
                              onBlur={() => setFocusedNumericInput(null)}
                              onChangeText={value => setNewTemplatePrice(sanitizeDecimalInput(value))}
                            />
                            <View style={styles.currencyOptionRow}>
                              {['TRY', 'USD', 'EUR'].map(currency => (
                                <TouchableOpacity key={currency} style={[styles.compactOptionButton, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, newTemplateCurrency === currency && styles.compactOptionButtonActive]} onPress={() => setNewTemplateCurrency(currency)}>
                                  <Text style={[styles.compactOptionText, { color: theme.textSecondary }, newTemplateCurrency === currency && styles.compactOptionTextActive]}>{currency}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                          <View style={styles.wrappedOptionRow}>
                            {Object.keys(CATEGORY_COLORS).map(category => (
                              <TouchableOpacity key={category} style={[styles.compactOptionButton, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, newTemplateCategory === category && styles.compactOptionButtonActive]} onPress={() => setNewTemplateCategory(category)}>
                                <Text style={[styles.compactOptionText, { color: theme.textSecondary }, newTemplateCategory === category && styles.compactOptionTextActive]}>{category}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                          <TouchableOpacity style={[styles.primaryButton, styles.inlineSaveButton]} onPress={addTemplate}>
                            <Text style={styles.primaryButtonText}>Şablonu Kaydet</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}

                  <View style={styles.formSection}>
                    <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Temel Bilgiler</Text>

                    <View style={[styles.twoColumnRow, isMobile && styles.singleColumnRow]}>
                      <View style={styles.formColumn}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Servis / Abonelik Adı</Text>
                        <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="Örn: Netflix, Ev Kirası" placeholderTextColor={theme.textMuted} value={formName} onChangeText={setFormName} />
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Tutar / Fiyat</Text>
                        <TextInput
                          style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }, focusedNumericInput === 'price' && styles.numericInputFocused]}
                          placeholder="0,00"
                          placeholderTextColor={theme.textMuted}
                          keyboardType="decimal-pad"
                          inputMode="decimal"
                          value={formPrice}
                          onFocus={() => setFocusedNumericInput('price')}
                          onBlur={() => setFocusedNumericInput(null)}
                          onChangeText={value => setFormPrice(sanitizeDecimalInput(value))}
                        />
                      </View>
                    </View>

                    <View style={[styles.twoColumnRow, isMobile && styles.singleColumnRow]}>
                      <View style={styles.formColumn}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Para Birimi</Text>
                        <View style={styles.currencyOptionRow}>
                          {['TRY', 'USD', 'EUR'].map(currency => (
                            <TouchableOpacity key={currency} style={[styles.compactOptionButton, styles.flexOptionButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formCurrency === currency && styles.compactOptionButtonActive]} onPress={() => setFormCurrency(currency)}>
                              <Text style={[styles.compactOptionText, { color: theme.textSecondary }, formCurrency === currency && styles.compactOptionTextActive]}>{currency}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Ödeme Periyodu</Text>
                        <View style={styles.periodOptionRow}>
                          <TouchableOpacity style={[styles.periodOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formPeriod === 'monthly' && styles.periodOptionActive]} onPress={() => setFormPeriod('monthly')}>
                            <Text style={[styles.periodOptionText, { color: theme.textSecondary }, formPeriod === 'monthly' && styles.periodOptionTextActive]}>Aylık</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.periodOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formPeriod === 'yearly' && styles.periodOptionActive]} onPress={() => setFormPeriod('yearly')}>
                            <Text style={[styles.periodOptionText, { color: theme.textSecondary }, formPeriod === 'yearly' && styles.periodOptionTextActive]}>Yıllık</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.projectionFieldCard, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                      <View style={styles.projectionFieldCopy}>
                        <Text style={[styles.inputLabel, { color: theme.textPrimary, marginBottom: 3 }]}>Yıllık Tahmini Artış / Zam Oranı (%)</Text>
                        <Text style={[styles.formSectionDescription, { color: theme.textMuted }]}>Seçilen Oran, Gelecek Yıllardaki Maliyet Ve Bütçe Projeksiyonlarına Bileşik Olarak Yansıtılır</Text>
                      </View>
                      <View style={styles.projectionRateInputWrap}>
                        <TextInput
                          style={[styles.textInput, styles.projectionRateInput, { backgroundColor: theme.cardBg, color: theme.textPrimary, borderColor: theme.cardBorder }, focusedNumericInput === 'annualRate' && styles.numericInputFocused]}
                          placeholder="0"
                          placeholderTextColor={theme.textMuted}
                          keyboardType="decimal-pad"
                          inputMode="decimal"
                          value={formAnnualIncreaseRate}
                          selectTextOnFocus={formAnnualIncreaseRate === '0'}
                          onFocus={() => setFocusedNumericInput('annualRate')}
                          onBlur={() => setFocusedNumericInput(null)}
                          onChangeText={value => setFormAnnualIncreaseRate(sanitizePercentageInput(value))}
                        />
                        <Text style={[styles.projectionPercent, { color: theme.textSecondary }]}>%</Text>
                      </View>
                    </View>

                    <View style={[styles.increasePeriodCard, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                      <View style={styles.increasePeriodCopy}>
                        <Text style={[styles.inputLabel, { color: theme.textPrimary, marginBottom: 3 }]}>Zam Uygulama Periyodu</Text>
                        <Text style={[styles.formSectionDescription, { color: theme.textMuted }]}>Artışın Abonelik Yıl Dönümünde Veya Her Takvim Yılı Başında Devreye Girmesini Seçin</Text>
                      </View>
                      <View style={styles.increasePeriodOptions}>
                        <TouchableOpacity
                          style={[styles.increasePeriodOption, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, formIncreaseApplicationPeriod === 'anniversary' && styles.increasePeriodOptionActive]}
                          onPress={() => setFormIncreaseApplicationPeriod('anniversary')}
                        >
                          <Text style={[styles.increasePeriodOptionTitle, { color: formIncreaseApplicationPeriod === 'anniversary' ? theme.accent : theme.textPrimary }]}>Abonelik Yıl Dönümünde</Text>
                          <Text style={[styles.increasePeriodOptionHint, { color: theme.textMuted }]}>Başlangıç Ayı Geldiğinde Zam Uygulanır</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.increasePeriodOption, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, formIncreaseApplicationPeriod === 'calendarYear' && styles.increasePeriodOptionActive]}
                          onPress={() => setFormIncreaseApplicationPeriod('calendarYear')}
                        >
                          <Text style={[styles.increasePeriodOptionTitle, { color: formIncreaseApplicationPeriod === 'calendarYear' ? theme.accent : theme.textPrimary }]}>Takvim Yılı Başında (Ocak)</Text>
                          <Text style={[styles.increasePeriodOptionHint, { color: theme.textMuted }]}>Her 1 Ocak Tarihinde Zam Uygulanır</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </>
              )}

              {formStep === 2 && (
                <>
                  <View style={styles.formSection}>
                    <View style={styles.formSectionHeader}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Ödeme Yapılan Kart / Hesap</Text>
                        <Text style={[styles.formSectionDescription, { color: theme.textMuted }]}>Aboneliğin Tahsil Edildiği Yöntemi Seçin</Text>
                      </View>
                      <TouchableOpacity onPress={() => setShowPaymentMethodForm(!showPaymentMethodForm)}>
                        <Text style={[styles.formSectionAction, { color: theme.accent }]}>{showPaymentMethodForm ? 'Kapat' : '+ Yöntem Ekle'}</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.removableOptionGrid}>
                      {safePaymentMethods.map(paymentMethod => (
                        <View key={paymentMethod} style={styles.removableOptionWrapper}>
                          <TouchableOpacity style={[styles.paymentMethodOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formPaymentMethod === paymentMethod && styles.paymentMethodOptionActive]} onPress={() => setFormPaymentMethod(paymentMethod)}>
                            <Text style={[styles.paymentMethodOptionText, { color: formPaymentMethod === paymentMethod ? '#ffffff' : theme.textSecondary }]} numberOfLines={1}>{paymentMethod}</Text>
                          </TouchableOpacity>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`${paymentMethod} ödeme yöntemini sil`}
                            hitSlop={6}
                            style={({ hovered, pressed }) => [
                              styles.removeOptionButton,
                              hovered && styles.removeOptionButtonHover,
                              pressed && styles.removeOptionButtonPressed
                            ]}
                            onPress={() => removePaymentMethod(paymentMethod)}
                          >
                            <RemoveXIcon color={formPaymentMethod === paymentMethod ? '#ffffff' : theme.textSecondary} />
                          </Pressable>
                        </View>
                      ))}
                    </View>

                    {showPaymentMethodForm && (
                      <View style={[styles.inlineForm, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                        <View style={styles.inlineInputRow}>
                          <TextInput style={[styles.textInput, styles.flexInput, { backgroundColor: theme.cardBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="Örn: Akbank Axess" placeholderTextColor={theme.textMuted} value={newPaymentMethodName} onChangeText={setNewPaymentMethodName} />
                          <TouchableOpacity style={[styles.primaryButton, styles.inlineAddButton]} onPress={addPaymentMethod}>
                            <Text style={styles.primaryButtonText}>Ekle</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={styles.formSection}>
                    <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Kategori</Text>
                    <View style={styles.wrappedOptionRow}>
                      {Object.keys(CATEGORY_COLORS).map(category => {
                        const isSelected = formCategory === category;
                        return (
                          <TouchableOpacity
                            key={category}
                            style={[
                              styles.categoryOption,
                              { backgroundColor: theme.inputBg, borderColor: theme.cardBorder },
                              isSelected && { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }
                            ]}
                            onPress={() => { setFormCategory(category); if (category === 'Kredi') setFormPeriod('monthly'); }}
                          >
                            <View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLORS[category] }]} />
                            <Text style={[styles.categoryOptionText, { color: isSelected ? theme.accent : theme.textSecondary }]}>{category}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {formCategory === 'Kredi' && (
                    <View style={[styles.creditScheduleCard, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                      <View style={styles.creditScheduleHeader}>
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Kredi / Taksit Planı</Text>
                          <Text style={[styles.creditScheduleDescription, { color: theme.textMuted }]}>Vade Ve İlk Taksit Ayını Girin Kayıt, Son Taksit Ayından Sonra Takvim Ve Raporlarda Otomatik Olarak Sona Erer</Text>
                        </View>
                        <View style={[styles.creditScheduleBadge, { backgroundColor: hexToRgba(CATEGORY_COLORS.Kredi, 0.12), borderColor: CATEGORY_COLORS.Kredi }]}>
                          <Text style={[styles.creditScheduleBadgeText, { color: CATEGORY_COLORS.Kredi }]}>Kredi</Text>
                        </View>
                      </View>

                      <View style={styles.creditScheduleFields}>
                        <View style={styles.creditInstallmentField}>
                          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Toplam Taksit Sayısı (Vade)</Text>
                          <TextInput
                            style={[styles.textInput, { backgroundColor: theme.cardBg, color: theme.textPrimary, borderColor: theme.cardBorder }, focusedNumericInput === 'creditInstallmentCount' && styles.numericInputFocused]}
                            placeholder="Örn: 12"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="number-pad"
                            inputMode="numeric"
                            value={formCreditInstallmentCount}
                            onFocus={() => setFocusedNumericInput('creditInstallmentCount')}
                            onBlur={() => setFocusedNumericInput(null)}
                            onChangeText={value => setFormCreditInstallmentCount(sanitizeNumericInput(value, { allowDecimal: false, max: 600 }))}
                          />
                        </View>

                        <View style={styles.creditStartDateField}>
                          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Başlangıç / İlk Taksit Tarihi</Text>
                          <View style={styles.creditStartDateRow}>
                            <TextInput
                              style={[styles.textInput, styles.creditDateInput, { backgroundColor: theme.cardBg, color: theme.textPrimary, borderColor: theme.cardBorder }, focusedNumericInput === 'creditStartMonth' && styles.numericInputFocused]}
                              placeholder="Ay"
                              placeholderTextColor={theme.textMuted}
                              keyboardType="number-pad"
                              inputMode="numeric"
                              value={formCreditStartMonth}
                              onFocus={() => setFocusedNumericInput('creditStartMonth')}
                              onBlur={() => setFocusedNumericInput(null)}
                              onChangeText={value => setFormCreditStartMonth(sanitizeNumericInput(value, { allowDecimal: false, max: 12 }))}
                            />
                            <TextInput
                              style={[styles.textInput, styles.creditDateInput, { backgroundColor: theme.cardBg, color: theme.textPrimary, borderColor: theme.cardBorder }, focusedNumericInput === 'creditStartYear' && styles.numericInputFocused]}
                              placeholder="Yıl"
                              placeholderTextColor={theme.textMuted}
                              keyboardType="number-pad"
                              inputMode="numeric"
                              value={formCreditStartYear}
                              onFocus={() => setFocusedNumericInput('creditStartYear')}
                              onBlur={() => setFocusedNumericInput(null)}
                              onChangeText={value => setFormCreditStartYear(sanitizeIntegerInput(value))}
                            />
                          </View>
                        </View>
                      </View>

                      {creditEndPreview ? (
                        <View style={[styles.creditEndInfo, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
                          <Text style={[styles.creditEndInfoIcon, { color: theme.accent }]}>✓</Text>
                          <View style={{ flex: 1, minWidth: 0 }}>
                            <Text style={[styles.creditEndInfoTitle, { color: theme.textPrimary }]}>Tahmini Son Taksit</Text>
                            <Text style={[styles.creditEndInfoText, { color: theme.textSecondary }]}>
                              {creditEndPreview.monthName} {creditEndPreview.year} · {creditInstallmentCountNumber} Aylık Vade Tamamlandığında Bu Kalem Rapor Ve Takvim Hesaplamalarından Otomatik Çıkarılır
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <Text style={[styles.creditScheduleHint, { color: theme.textMuted }]}>Bitiş Tarihini Görmek İçin Vade İle Başlangıç Ayı/Yılını Girin</Text>
                      )}
                    </View>
                  )}

                  <View style={styles.formSection}>
                    <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Ödeme Tarihi</Text>
                    <View style={styles.dateInputRow}>
                      <View style={styles.dateInputField}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Gün</Text>
                        <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }, focusedNumericInput === 'day' && styles.numericInputFocused]} placeholder="1" placeholderTextColor={theme.textMuted} keyboardType="number-pad" inputMode="numeric" value={formDay} onFocus={() => setFocusedNumericInput('day')} onBlur={() => setFocusedNumericInput(null)} onChangeText={value => setFormDay(sanitizeIntegerInput(value))} />
                      </View>
                      <View style={styles.dateInputField}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Ay</Text>
                        <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }, focusedNumericInput === 'month' && styles.numericInputFocused]} placeholder="1" placeholderTextColor={theme.textMuted} keyboardType="number-pad" inputMode="numeric" value={formMonth} onFocus={() => setFocusedNumericInput('month')} onBlur={() => setFocusedNumericInput(null)} onChangeText={value => setFormMonth(sanitizeIntegerInput(value))} />
                      </View>
                      <View style={[styles.dateInputField, styles.dateInputYearField]}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Yıl</Text>
                        <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }, focusedNumericInput === 'year' && styles.numericInputFocused]} placeholder="2026" placeholderTextColor={theme.textMuted} keyboardType="number-pad" inputMode="numeric" value={formYear} onFocus={() => setFocusedNumericInput('year')} onBlur={() => setFocusedNumericInput(null)} onChangeText={value => setFormYear(sanitizeIntegerInput(value))} />
                      </View>
                    </View>
                    <Text style={[styles.helperText, { color: theme.textMuted }]}>{formCategory === 'Kredi' ? 'Kredi Kayıtlarında Gün Alanı Taksit Gününü Belirler; Taksit Başlangıç Ayı Ve Yılı Yukarıdaki Kredi / Taksit Planı Alanından Alınır' : 'Aylık Ödemelerde Başlangıç Ayı, Yıllık Ödemelerde Tahsilat Ayı Olarak Kullanılır'}</Text>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Hatırlatıcı Kuralı</Text>
                    <View style={styles.wrappedOptionRow}>
                      {NOTIFICATION_OPTIONS.map(option => (
                        <TouchableOpacity key={option.value} style={[styles.compactOptionButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formNotificationDays === option.value && styles.compactOptionButtonActive]} onPress={() => setFormNotificationDays(option.value)}>
                          <Text style={[styles.compactOptionText, { color: theme.textSecondary }, formNotificationDays === option.value && styles.compactOptionTextActive]}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {formNotificationDays !== -1 && (
                      <View style={styles.notificationChannelBlock}>
                        <Text style={[styles.inputLabel, styles.notificationChannelLabel, { color: theme.textSecondary }]}>Bildirim Kanalı</Text>
                        <View style={styles.periodOptionRow}>
                          <TouchableOpacity style={[styles.periodOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formNotificationChannel === 'email' && styles.periodOptionActive]} onPress={() => setFormNotificationChannel('email')}>
                            <Text style={[styles.periodOptionText, { color: theme.textSecondary }, formNotificationChannel === 'email' && styles.periodOptionTextActive]}>📧 E-posta</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.periodOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formNotificationChannel === 'browser' && styles.periodOptionActive]} onPress={() => setFormNotificationChannel('browser')}>
                            <Text style={[styles.periodOptionText, { color: theme.textSecondary }, formNotificationChannel === 'browser' && styles.periodOptionTextActive]}>🌐 Tarayıcı Bildirimi</Text>
                          </TouchableOpacity>
                        </View>

                        {formNotificationChannel === 'email' && (
                          <View style={styles.notificationEmailField}>
                            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Bildirim E-posta Adresi</Text>
                            <TextInput
                              style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
                              placeholder="ornek@eposta.com"
                              placeholderTextColor={theme.textMuted}
                              keyboardType="email-address"
                              autoCapitalize="none"
                              autoCorrect={false}
                              value={formNotificationEmail}
                              onChangeText={value => setFormNotificationEmail(value.replace(/\s/g, ''))}
                            />
                            <Text style={[styles.helperText, { color: theme.textMuted }]}>Hatırlatıcı E-Postaları Bu Adrese Yönlendirilecektir</Text>
                          </View>
                        )}

                        {formNotificationChannel === 'browser' && (
                          <View style={[styles.notificationHintBox, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
                            <Text style={[styles.notificationHintIcon, { color: theme.accent }]}>i</Text>
                            <Text style={[styles.notificationHintText, { color: theme.textSecondary }]}>Tarayıcı Bildirimlerinin Çalışması İçin Cihazınızda Ve Tarayıcınızda Bildirim İzninin Açık Olması Gerekir İzin Sorulduğunda “İzin Ver” Seçeneğini Kullanın</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>

                  <View style={styles.formSection}>
                    <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>İptal / Yönetim Bağlantısı</Text>
                    <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="https://..." placeholderTextColor={theme.textMuted} keyboardType="url" autoCapitalize="none" value={formCancelUrl} onChangeText={setFormCancelUrl} />
                  </View>
                </>
              )}
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: theme.cardBorder, backgroundColor: theme.cardBg }]}>
              {formStep === 1 ? (
                <>
                  <TouchableOpacity style={[styles.modalCancelButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={closeSubscriptionForm}>
                    <Text style={[styles.modalCancelButtonText, { color: theme.textSecondary }]}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalSaveButton} onPress={goToStepTwo}>
                    <Text style={styles.modalSaveButtonText}>İleri →</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity style={[styles.modalCancelButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => setFormStep(1)}>
                    <Text style={[styles.modalCancelButtonText, { color: theme.textSecondary }]}>← Geri</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveSubscription}>
                    <Text style={styles.modalSaveButtonText}>Kaydet</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={confirmModal.visible} transparent animationType="fade" onRequestClose={closeConfirmModal}>
        <View style={styles.warningOverlay}>
          <Pressable style={styles.confirmBackdrop} onPress={closeConfirmModal} />
          <View style={[styles.warningCard, styles.confirmationCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[styles.warningIconBox, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
              <View style={styles.warningTriangle}>
                <Text style={styles.warningBang}>!</Text>
              </View>
            </View>
            <Text style={[styles.warningTitle, { color: theme.textPrimary }]}>{confirmModal.title}</Text>
            <Text style={[styles.warningMessage, styles.confirmationMessage, { color: theme.textSecondary }]}>{confirmModal.message}</Text>
            <View style={styles.confirmationActions}>
              <TouchableOpacity style={[styles.confirmationSecondaryButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={closeConfirmModal}>
                <Text style={[styles.confirmationSecondaryText, { color: theme.textSecondary }]}>{confirmModal.cancelLabel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmationPrimaryButton} onPress={approveConfirmModal}>
                <Text style={styles.confirmationPrimaryText}>{confirmModal.confirmLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={duplicateWarning.visible} transparent animationType="fade" onRequestClose={() => setDuplicateWarning({ visible: false, name: '' })}>
        <View style={styles.warningOverlay}>
          <View style={[styles.warningCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[styles.warningIconBox, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
              <View style={styles.warningTriangle}>
                <Text style={styles.warningBang}>!</Text>
              </View>
            </View>
            <Text style={[styles.warningTitle, { color: theme.textPrimary }]}>Bu Abonelik Zaten Kayıtlı</Text>
            <Text style={[styles.warningMessage, { color: theme.textSecondary }]}>"{duplicateWarning.name}" İsimli Abonelik Zaten Listenizde Bulunuyor.</Text>
            <Text style={[styles.warningHint, { color: theme.textMuted }]}>Mevcut Kaydı Düzenleyebilir Veya Aboneliği Farklı Bir Adla Ekleyebilirsiniz</Text>
            <TouchableOpacity style={styles.warningButton} onPress={() => setDuplicateWarning({ visible: false, name: '' })}>
              <Text style={styles.warningButtonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {toast.visible && (
        <View pointerEvents="none" style={[styles.toastWrap, { backgroundColor: toast.type === 'success' ? hexToRgba(theme.success, 0.96) : hexToRgba(theme.danger, 0.96) }]}>
          <View style={styles.toastDot}>
            <Text style={styles.toastDotText}>{toast.type === 'success' ? '✓' : '!'}</Text>
          </View>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}

      {/* Genel doğrulama / bilgi uyarısı - alert() yerine kullanılan şık modal */}
      <Modal visible={alertModal.visible} transparent animationType="fade" onRequestClose={closeAlertModal}>
        <View style={styles.warningOverlay}>
          <View style={[styles.warningCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[styles.warningIconBox, alertModal.type === 'success' ? styles.successIconBox : { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
              {alertModal.type === 'success' ? (
                <Text style={styles.successCheck}>✓</Text>
              ) : (
                <View style={styles.warningTriangle}>
                  <Text style={styles.warningBang}>!</Text>
                </View>
              )}
            </View>
            <Text style={[styles.warningTitle, { color: theme.textPrimary }]}>{alertModal.title}</Text>
            {!!alertModal.message && <Text style={[styles.warningMessage, { color: theme.textSecondary }]}>{alertModal.message}</Text>}
            <Pressable style={({ hovered, pressed }) => [styles.warningButton, (hovered || pressed) && styles.premiumButtonHover]} onPress={closeAlertModal}>
              <Text style={styles.warningButtonText}>Tamam</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </LanguageContext.Provider>
  );
}

function createStyles(theme, isMobile, fontScale) {
  const font = value => Math.round(value * fontScale);
  const glassSurface = Platform.OS === 'web' ? { backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)' } : {};

  return StyleSheet.create({
    container: { flex: 1, width: '100%', minHeight: 0, overflow: 'hidden', ...(Platform.OS === 'web' ? { height: '100dvh' } : { height: '100%' }) },
    appWrapper: { flex: 1, width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' },
    appWrapperDesktop: { flexDirection: 'row', width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' },

    glassSurface,
    elevatedSurface: {
      ...(Platform.OS === 'web'
        ? { boxShadow: '0 18px 46px rgba(3,7,18,0.28), 0 3px 12px rgba(79,70,229,0.10)' }
        : { shadowColor: '#020617', shadowOpacity: 0.28, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 8 })
    },
    appGlow: { position: 'absolute', width: isMobile ? 220 : 460, height: isMobile ? 220 : 460, borderRadius: 999, opacity: 0.10 },
    appGlowTop: { top: isMobile ? -120 : -230, left: isMobile ? -100 : 120 },
    appGlowBottom: { bottom: isMobile ? -130 : -240, right: isMobile ? -110 : -150, opacity: 0.07 },

    authScroll: { flex: 1, width: '100%' },
    authScrollContent: { flexGrow: 1, minHeight: '100%', justifyContent: 'center' },
    authWrapper: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: isMobile ? 16 : 28, paddingVertical: isMobile ? 24 : 42 },
    authGlow: { position: 'absolute', width: isMobile ? 230 : 420, height: isMobile ? 230 : 420, borderRadius: 999, opacity: 0.16, backgroundColor: '#6965e8' },
    authGlowTop: { top: isMobile ? -110 : -180, left: isMobile ? -90 : -140 },
    authGlowBottom: { bottom: isMobile ? -120 : -210, right: isMobile ? -90 : -150, backgroundColor: '#3b82f6', opacity: 0.12 },
    authCard: { width: '100%', maxWidth: 500, borderWidth: 1, borderRadius: isMobile ? 22 : 26, paddingHorizontal: isMobile ? 22 : 38, paddingVertical: isMobile ? 24 : 34 },
    authTopUtilityRow: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
    languageSegment: { flexDirection: 'row', alignItems: 'center', padding: 3, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(154,163,184,0.28)', backgroundColor: 'rgba(37,43,56,0.72)', ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } : {}) },
    languageSegmentButton: { minWidth: 34, height: 28, paddingHorizontal: 8, borderRadius: 7, alignItems: 'center', justifyContent: 'center', ...(Platform.OS === 'web' ? { cursor: 'pointer', transitionDuration: '150ms' } : {}) },
    languageSegmentButtonActive: { backgroundColor: '#6965e8', ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(105,101,232,0.24)' } : {}) },
    languageSegmentText: { color: '#aeb7c2', fontSize: font(10), fontWeight: '800', letterSpacing: 0.4 },
    languageSegmentTextActive: { color: '#ffffff' },
    headerLanguageSegment: { flexShrink: 0 },
    authHeader: { alignItems: 'center', marginBottom: isMobile ? 16 : 20 },
    authLogo: { fontSize: font(isMobile ? 27 : 30), fontWeight: '800', letterSpacing: -0.5 },
    authSubtitle: { fontSize: font(11), marginTop: 6 },
    authTitle: { fontSize: font(19), fontWeight: '800', textAlign: 'center', marginTop: 4, marginBottom: isMobile ? 18 : 22 },
    authFieldGroup: { width: '100%', marginBottom: isMobile ? 14 : 17 },
    authFieldLabel: { marginBottom: isMobile ? 8 : 9 },
    authTextInput: { minHeight: isMobile ? 52 : 54, paddingHorizontal: isMobile ? 16 : 18, paddingVertical: isMobile ? 14 : 15, borderRadius: 12 },
    passwordInputShell: { width: '100%', minHeight: isMobile ? 52 : 54, borderWidth: 1, borderRadius: 12, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
    authPasswordInput: { flex: 1, minWidth: 0, minHeight: isMobile ? 50 : 52, paddingLeft: isMobile ? 16 : 18, paddingRight: 8, paddingVertical: isMobile ? 14 : 15, fontSize: font(13), outlineStyle: 'none' },
    passwordTextInput: { flex: 1, minWidth: 0, minHeight: 48, paddingLeft: 12, paddingRight: 8, paddingVertical: 10, fontSize: font(13), outlineStyle: 'none' },
    eyeButton: { width: 46, minHeight: 48, alignItems: 'center', justifyContent: 'center', position: 'relative', opacity: 0.88, ...(Platform.OS === 'web' ? { cursor: 'pointer', transitionDuration: '160ms' } : {}) },
    eyeButtonHover: { opacity: 1, backgroundColor: 'rgba(139,213,255,0.08)' },
    forgotPasswordButton: { alignSelf: 'flex-end', paddingVertical: 8, paddingLeft: 12 },
    forgotPasswordText: { color: '#aeb7c2', fontSize: font(11), fontWeight: '600' },
    rememberRow: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: -4, marginBottom: 14, paddingVertical: 5, ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}) },
    rememberCheckbox: { width: 19, height: 19, borderRadius: 6, borderWidth: 1, borderColor: '#657083', backgroundColor: '#252b38', alignItems: 'center', justifyContent: 'center' },
    rememberCheckboxActive: { backgroundColor: '#6965e8', borderColor: '#8b87ff' },
    rememberCheckMark: { color: '#ffffff', fontSize: font(12), fontWeight: '900', lineHeight: font(15) },
    rememberLabel: { color: '#c5cbd6', fontSize: font(11), fontWeight: '700' },
    forgotPasswordBackdrop: { ...StyleSheet.absoluteFillObject },
    forgotPasswordModal: { width: '100%', maxWidth: 520, borderWidth: 1, borderRadius: isMobile ? 22 : 26, padding: isMobile ? 22 : 30, zIndex: 2 },
    forgotPasswordModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
    forgotPasswordIconBox: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(105,101,232,0.14)', borderWidth: 1, borderColor: 'rgba(124,120,240,0.72)' },
    forgotPasswordCloseButton: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(37,43,56,0.90)', borderWidth: 1, borderColor: '#566071', ...(Platform.OS === 'web' ? { cursor: 'pointer', transitionDuration: '160ms', boxShadow: '0 4px 12px rgba(0,0,0,0.14)' } : {}) },
    forgotPasswordCloseButtonHover: { backgroundColor: 'rgba(105,101,232,0.16)', borderColor: '#7c78f0' },
    forgotPasswordCloseText: { color: '#c5cbd6', fontSize: font(22), lineHeight: font(23), fontWeight: '400', marginTop: -2 },
    forgotPasswordTitle: { color: '#f8fafc', fontSize: font(isMobile ? 20 : 22), fontWeight: '800', letterSpacing: -0.25 },
    forgotPasswordDescription: { color: '#b9c1cf', fontSize: font(12), lineHeight: font(19), marginTop: 8, marginBottom: 22 },
    forgotPasswordFieldGroup: { width: '100%' },
    forgotPasswordLabel: { color: '#d2d7e0', fontSize: font(11), fontWeight: '700', marginBottom: 9 },
    forgotPasswordInput: { width: '100%', minHeight: 54, borderWidth: 1, borderRadius: 13, backgroundColor: '#252b38', color: '#f8fafc', paddingHorizontal: 17, paddingVertical: 14, fontSize: font(13), outlineStyle: 'none', ...(Platform.OS === 'web' ? { transitionDuration: '160ms' } : {}) },
    forgotPasswordInputFocused: { borderColor: '#7c78f0', ...(Platform.OS === 'web' ? { boxShadow: '0 0 0 3px rgba(105,101,232,0.14)' } : {}) },
    forgotPasswordErrorText: { color: '#fda4af', fontSize: font(10.5), fontWeight: '600', lineHeight: font(16), marginTop: 8 },
    forgotPasswordInfoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 18, padding: 13, borderRadius: 12, backgroundColor: 'rgba(99,179,255,0.08)', borderWidth: 1, borderColor: 'rgba(99,179,255,0.18)' },
    forgotPasswordInfoIcon: { width: 20, height: 20, borderRadius: 10, overflow: 'hidden', textAlign: 'center', color: '#b9ddff', backgroundColor: 'rgba(99,179,255,0.14)', fontSize: font(11), lineHeight: font(20), fontWeight: '800' },
    forgotPasswordInfoText: { flex: 1, minWidth: 0, color: '#aeb7c2', fontSize: font(10.5), lineHeight: font(16) },
    forgotPasswordActions: { flexDirection: isMobile ? 'column-reverse' : 'row', gap: 10, marginTop: 22 },
    forgotPasswordSecondaryButton: { minHeight: 50, flex: isMobile ? 0 : 0.72, paddingHorizontal: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#252b38', borderWidth: 1, borderColor: '#566071', ...(Platform.OS === 'web' ? { cursor: 'pointer', transitionDuration: '160ms' } : {}) },
    forgotPasswordSecondaryButtonHover: { borderColor: '#7c78f0', backgroundColor: 'rgba(105,101,232,0.10)' },
    forgotPasswordSecondaryButtonText: { color: '#d2d7e0', fontSize: font(11.5), fontWeight: '700' },
    forgotPasswordPrimaryButton: { minHeight: 50, flex: isMobile ? 0 : 1.45, paddingHorizontal: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#6965e8', borderWidth: 1, borderColor: '#7c78f0', ...(Platform.OS === 'web' ? { cursor: 'pointer', transitionDuration: '160ms', boxShadow: '0 10px 26px rgba(105,101,232,0.22)' } : {}) },
    forgotPasswordPrimaryButtonText: { color: '#ffffff', fontSize: font(11.5), fontWeight: '800', textAlign: 'center' },
    forgotPasswordButtonDisabled: { opacity: 0.62 },
    authErrorText: { color: '#fda4af', fontSize: font(11), fontWeight: '600', lineHeight: font(17), marginBottom: 10 },
    authPrimaryButton: { marginTop: 2, minHeight: 52, justifyContent: 'center', borderRadius: 12 },
    authDividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 18 },
    authDividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(174,183,194,0.24)' },
    authDividerText: { color: '#9aa3b2', fontSize: font(10), fontWeight: '600' },
    googleButton: { minHeight: 52, borderWidth: 1, borderColor: '#596375', backgroundColor: 'rgba(37,43,56,0.86)', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 16 },
    googleIconBox: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
    googleIconText: { color: '#4285f4', fontSize: font(14), fontWeight: '900' },
    googleButtonText: { color: '#eef2f7', fontSize: font(12), fontWeight: '700' },
    authSwitchButton: { marginTop: 18, alignItems: 'center', paddingVertical: 6 },
    authSwitchText: { fontSize: font(12), fontWeight: '700' },

    sidebarContainer: { width: 250, minWidth: 250, flexShrink: 0, padding: 20, borderRightWidth: 1, ...(Platform.OS === 'web' ? { boxShadow: '14px 0 42px rgba(3,7,18,0.20)' } : { elevation: 8 }) },
    sidebarHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { fontSize: font(22), fontWeight: 'bold' },
    proBadge: { backgroundColor: '#6366f1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 6 },
    proBadgeText: { color: '#ffffff', fontSize: font(10), fontWeight: 'bold' },
    headerSubtitle: { fontSize: font(11), marginTop: 4, marginBottom: 24 },

    sidebarNavGroup: { gap: 6, flex: 1 },
    sidebarNavButton: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
    sidebarNavButtonActive: { backgroundColor: theme.activeButtonSoft },
    sidebarNavIcon: { fontSize: font(16) },
    sidebarNavText: { fontSize: font(13), fontWeight: '600' },

    sidebarFooter: { gap: 10, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.cardBorder },

    contentWrapper: { flex: 1, height: '100%', minHeight: 0, overflow: 'hidden' },

    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, zIndex: 10, ...(Platform.OS === 'web' ? { boxShadow: '0 10px 34px rgba(3,7,18,0.18)' } : { elevation: 5 }) },
    pageHeaderInfo: { flex: 1, marginRight: 12 },
    pageHeaderTitle: { fontSize: font(18), fontWeight: 'bold' },
    pageHeaderDescription: { fontSize: font(11), marginTop: 2 },

    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    miniRatesBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
    miniRatesIcon: { fontSize: font(12) },
    miniRatesText: { fontSize: font(11), fontWeight: '600' },

    iconButton: { width: 34, height: 34, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    iconButtonText: { fontSize: font(14) },
    userSettingsButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    profileGlyph: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    profileGlyphHead: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#b9ddff', position: 'absolute', top: 1, ...(Platform.OS === 'web' ? { boxShadow: '0 0 10px rgba(139,213,255,0.55)' } : {}) },
    profileGlyphBody: { width: 15, height: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, backgroundColor: '#8b9dff', position: 'absolute', bottom: 1, ...(Platform.OS === 'web' ? { boxShadow: '0 0 12px rgba(139,157,255,0.45)' } : {}) },

    mainScroll: { flex: 1, width: '100%' },
    scrollContent: { padding: isMobile ? 14 : 24, paddingBottom: 60, gap: 18, position: 'relative' },

    summaryCard: { borderRadius: 20, padding: isMobile ? 18 : 22, borderWidth: 1, overflow: 'hidden', ...(Platform.OS === 'web' ? { boxShadow: '0 24px 56px rgba(49,46,129,0.30)' } : { elevation: 10 }) },
    summaryTopRow: { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'flex-start', justifyContent: 'space-between', gap: 12 },
    summaryLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    summaryLabel: { color: 'rgba(255,255,255,0.82)', fontSize: font(12), fontWeight: '600' },
    changeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    changeBadgeText: { fontSize: font(10), fontWeight: 'bold' },
    summaryValue: { color: '#ffffff', fontSize: font(28), fontWeight: 'bold', marginBottom: 16 },
    summaryStatsRow: { flexDirection: 'row', gap: 12, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
    summaryStatBox: { flex: 1 },
    summaryStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: font(10), marginBottom: 2 },
    summaryStatValue: { color: '#ffffff', fontSize: font(13), fontWeight: 'bold' },
    dashboardYearButton: { minWidth: 118, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', backgroundColor: 'rgba(17,24,39,0.18)' },
    dashboardYearCaption: { color: 'rgba(255,255,255,0.66)', fontSize: font(9), fontWeight: '600' },
    dashboardYearValue: { color: '#ffffff', fontSize: font(15), fontWeight: '800', marginTop: 1 },
    dashboardYearChevron: { color: '#ffffff', fontSize: font(17), fontWeight: '700' },

    searchInput: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, minHeight: 48, fontSize: font(13), ...(Platform.OS === 'web' ? { boxShadow: '0 10px 24px rgba(3,7,18,0.14)' } : {}) },

    singleFilterSection: { gap: 14, width: '100%', borderWidth: 1, borderRadius: 18, padding: isMobile ? 14 : 16, overflow: 'hidden' },
    filterSectionHeader: { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 10 },
    sectionLabel: { fontSize: font(13), fontWeight: 'bold' },
    filterSectionHint: { fontSize: font(10), marginTop: 2 },
    activeFilterBadge: { maxWidth: '100%', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
    activeFilterBadgeText: { fontSize: font(10), fontWeight: '700' },
    filterOptionGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'flex-start', gap: 8, overflow: 'hidden' },
    horizontalOptionRow: { gap: 8, paddingBottom: 4 },
    filterOption: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, minHeight: 44, minWidth: isMobile ? '47%' : 148, alignItems: 'center', justifyContent: 'center', flexGrow: 1, flexBasis: isMobile ? '47%' : 148, flexShrink: 1, maxWidth: isMobile ? '100%' : 260 },
    filterOptionActive: { backgroundColor: theme.activeButton, borderColor: theme.activeButtonBorder, ...(Platform.OS === 'web' ? { boxShadow: '0 8px 20px rgba(105,101,232,0.22)' } : {}) },
    filterOptionText: { fontSize: font(11), fontWeight: '650', textAlign: 'center' },
    filterOptionTextActive: { color: '#ffffff', fontWeight: '800' },

    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    sectionTitle: { fontSize: font(15), fontWeight: 'bold' },
    resultCount: { fontSize: font(11) },

    emptyCard: { borderWidth: 1, borderRadius: 18, padding: isMobile ? 22 : 28, alignItems: 'center', justifyContent: 'center' },
    emptyIcon: { fontSize: font(28), marginBottom: 8 },
    emptyTitle: { fontSize: font(14), fontWeight: 'bold', marginBottom: 4 },
    emptyDescription: { fontSize: font(12), textAlign: 'center' },

    subscriptionCard: { borderWidth: 1, borderRadius: 18, padding: isMobile ? 14 : 16, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: 14, overflow: 'hidden' },
    subscriptionMain: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    serviceIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    serviceIconText: { color: '#ffffff', fontSize: font(16), fontWeight: 'bold' },
    subscriptionInfo: { flex: 1 },
    subscriptionTitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 3 },
    subscriptionName: { fontSize: font(14), fontWeight: 'bold' },
    remainingDaysBadge: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    remainingDaysText: { fontSize: font(10), fontWeight: 'bold' },
    informationTag: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    informationTagText: { fontSize: font(10), fontWeight: '600' },
    subscriptionSubtitle: { fontSize: font(11) },

    subscriptionRight: { alignItems: isMobile ? 'flex-start' : 'flex-end', gap: 6 },
    subscriptionPrice: { fontSize: font(15), fontWeight: 'bold' },
    convertedPrice: { fontSize: font(11), fontWeight: '600' },
    subscriptionActions: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
    smallActionButton: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
    smallActionText: { fontSize: font(11), fontWeight: '600' },
    deleteButton: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 4 },
    deleteButtonText: { fontSize: font(11) },

    calendarSection: { gap: 14 },
    calendarNavigation: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    calendarNavigationButton: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
    calendarNavigationText: { fontSize: font(12), fontWeight: 'bold' },
    calendarTitle: { fontSize: font(16), fontWeight: 'bold' },
    calendarYearSelectorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
    calendarYearSelectorLabel: { fontSize: font(11) },
    calendarYearSelectButton: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 6 },
    calendarYearSelectValue: { fontSize: font(12), fontWeight: 'bold' },
    yearSelectChevron: { fontSize: font(12), fontWeight: 'bold' },

    calendarContainer: { borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 18, overflow: 'hidden', backgroundColor: theme.cardBg },
    calendarWeekHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.cardBorder },
    calendarWeekDay: { flex: 1, paddingVertical: 10, alignItems: 'center' },
    calendarWeekDayText: { fontSize: font(11), fontWeight: 'bold' },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    calendarDay: { width: '14.28%', height: 95, borderWidth: 0.5, borderColor: theme.cardBorder, padding: 4 },
    calendarDayEmpty: { opacity: 0.3 },
    calendarDayActive: { borderWidth: 1 },
    calendarDayNumber: { fontSize: font(11), fontWeight: 'bold', marginBottom: 2 },
    calendarDayScroll: { flex: 1 },
    calendarDayScrollContent: { gap: 2 },
    calendarSubscriptionBadge: { borderRadius: 4, paddingHorizontal: 3, paddingVertical: 2 },
    calendarSubscriptionName: { color: '#ffffff', fontSize: font(9), fontWeight: 'bold' },
    calendarSubscriptionPrice: { color: 'rgba(255,255,255,0.85)', fontSize: font(8) },

    analyticsSection: { gap: 16 },
    analysisToolbar: { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: 10 },
    analysisToolbarLabel: { fontSize: font(11) },
    analysisToolbarHint: { fontSize: font(13), fontWeight: 'bold', marginTop: 1 },
    yearSelectButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, alignSelf: isMobile ? 'stretch' : 'auto' },
    yearSelectCaption: { fontSize: font(9) },
    yearSelectValue: { fontSize: font(15), fontWeight: 'bold' },

    insightBox: { borderWidth: 1, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, overflow: 'hidden' },
    insightIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
    insightTitle: { color: '#ffffff', fontSize: font(12), fontWeight: 'bold', marginBottom: 2 },
    insightText: { color: 'rgba(255,255,255,0.9)', fontSize: font(11), lineHeight: 16 },

    panel: { borderWidth: 1, borderRadius: 20, padding: isMobile ? 14 : 18, overflow: 'hidden' },
    analysisPrimaryPanel: {},
    panelTitle: { fontSize: font(15), fontWeight: 'bold', marginBottom: 2 },
    panelDescription: { fontSize: font(11), marginTop: 2, marginBottom: 0, lineHeight: font(16) },
    analysisPanelHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
    analyticsSegmentedControl: { width: '100%', borderWidth: 1, borderRadius: 13, padding: 4, flexDirection: 'row', gap: 4, marginBottom: 14, overflow: 'hidden' },
    analyticsSegmentButton: { flex: 1, minWidth: 0, minHeight: isMobile ? 42 : 40, borderWidth: 1, borderColor: 'transparent', borderRadius: 10, paddingHorizontal: isMobile ? 8 : 12, paddingVertical: 9, alignItems: 'center', justifyContent: 'center', ...(Platform.OS === 'web' ? { cursor: 'pointer', transitionDuration: '160ms' } : {}) },
    analyticsSegmentButtonInteractive: { opacity: 0.94, transform: [{ scale: 0.995 }] },
    analyticsSegmentText: { fontSize: font(isMobile ? 9.5 : 10.5), fontWeight: '800', textAlign: 'center' },
    categoryLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: isMobile ? 8 : 10, marginBottom: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: font(isMobile ? 9 : 10) },

    chartPopover: { width: '100%', minWidth: 0, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, marginBottom: 10, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? 3 : 10 },
    chartPopoverMonth: { fontSize: font(11), fontWeight: '800' },
    chartPopoverHint: { fontSize: font(9), marginTop: 1 },
    chartPopoverAmount: { fontSize: font(isMobile ? 13 : 14), fontWeight: '900', flexShrink: 1 },
    chartScrollContent: { paddingBottom: 4, minWidth: isMobile ? 620 : '100%', flexGrow: 1 },
    chartArea: { width: isMobile ? 620 : '100%', minWidth: isMobile ? 620 : 0, flexDirection: 'row', height: isMobile ? 210 : 220, alignItems: 'flex-end', justifyContent: 'space-between', gap: isMobile ? 7 : 0, paddingHorizontal: isMobile ? 6 : 8 },
    chartColumn: { minWidth: isMobile ? 43 : 0, maxWidth: isMobile ? 43 : 76, flex: isMobile ? 0 : 1, flexShrink: isMobile ? 0 : 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end', paddingHorizontal: isMobile ? 2 : 2, borderRadius: 10, ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}) },
    chartColumnPressed: { opacity: 0.86, transform: [{ scale: 0.985 }] },
    chartAmount: { fontSize: font(8), marginBottom: 4, height: 14, width: '100%', textAlign: 'center' },
    chartTrack: { width: isMobile ? 22 : 30, maxWidth: '78%', flex: 1, borderWidth: 1, borderRadius: isMobile ? 7 : 8, overflow: 'hidden', justifyContent: 'flex-end' },
    chartTrackSelected: { borderWidth: 2, ...(Platform.OS === 'web' ? { boxShadow: '0 0 0 2px rgba(105,101,232,0.12)' } : {}) },
    chartStack: { width: '100%', flexDirection: 'column-reverse' },
    chartSegment: { width: '100%' },
    chartMonthLabel: { fontSize: font(isMobile ? 9 : 10), fontWeight: 'bold', marginTop: 7 },
    chartInteractionHint: { fontSize: font(9), lineHeight: font(13), marginTop: 6 },
    chartFooter: { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? 4 : 0, paddingTop: 12, marginTop: 14, borderTopWidth: 1 },
    chartFooterLabel: { fontSize: font(12), fontWeight: 'bold' },
    chartFooterValue: { fontSize: font(14), fontWeight: 'bold' },

    analysisSectionCard: { borderWidth: 1, borderRadius: 20, padding: isMobile ? 14 : 18, gap: 14, overflow: 'hidden' },
    distributionSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 },
    distributionTitle: { fontSize: font(14), fontWeight: 'bold' },
    distributionTitleNoTop: { marginTop: 0 },
    distributionSubtitle: { fontSize: font(11), marginTop: 2 },
    monthlyCommitmentBadge: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'flex-end' },
    monthlyCommitmentBadgeLabel: { fontSize: font(9) },
    monthlyCommitmentBadgeValue: { fontSize: font(13), fontWeight: 'bold' },

    monthlyPaymentGrid: { gap: 10 },
    monthlyPaymentCard: { borderWidth: 1, borderRadius: 12, padding: 12, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? 9 : 12, minWidth: 0, overflow: 'hidden' },
    monthlyPaymentIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    monthlyPaymentIconText: { fontSize: font(14) },
    monthlyPaymentContent: { flex: 1, minWidth: 0, width: isMobile ? '100%' : 'auto' },
    monthlyPaymentName: { fontSize: font(13), fontWeight: 'bold', marginBottom: 2 },
    monthlyPaymentMeta: { fontSize: font(10) },
    monthlyPaymentAmount: { fontSize: font(14), fontWeight: 'bold', flexShrink: 1, alignSelf: isMobile ? 'flex-end' : 'auto' },
    monthlyPaymentPeriod: { fontSize: font(10) },

    distributionCard: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 },
    distributionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, minWidth: 0 },
    distributionNameGroup: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0, flexShrink: 1 },
    distributionColorDot: { width: 10, height: 10, borderRadius: 5 },
    distributionName: { fontSize: font(13), fontWeight: 'bold' },
    distributionAmount: { fontSize: font(12), fontWeight: '600', flexShrink: 1, textAlign: 'right' },
    noDataText: { fontSize: font(12), fontStyle: 'italic' },

    progressTrack: { width: '100%', minWidth: 0, height: 6, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },

    bottomNavigation: { flexDirection: 'row', height: isMobile ? 68 : 60, borderTopWidth: 1, alignItems: 'center', justifyContent: 'space-around', zIndex: 10, paddingBottom: isMobile ? 4 : 0 },
    bottomNavigationItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
    bottomNavigationIcon: { fontSize: font(16) },
    bottomNavigationText: { fontSize: font(isMobile ? 9 : 10), fontWeight: 'bold' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 16, ...(Platform.OS === 'web' ? { backdropFilter: 'blur(8px)' } : {}) },
    settingsBackdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
    userSettingsModal: { width: isMobile ? '96%' : '100%', maxWidth: 540, maxHeight: isMobile ? '94%' : '90%', borderWidth: 1, borderRadius: isMobile ? 18 : 22, overflow: 'hidden' },
    userSettingsScroll: { flexGrow: 0, maxHeight: isMobile ? '100%' : 480, width: '100%' },
    userSettingsContent: { padding: isMobile ? 14 : 20, paddingTop: 4, paddingBottom: 24, gap: 18 },
    settingsInfoCard: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 12 },
    settingsInfoRow: { flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 4, paddingTop: 4 },
    settingsInfoLabel: { fontSize: font(11), fontWeight: '600' },
    settingsInfoValue: { fontSize: font(12), fontWeight: '700', flexShrink: 1, textAlign: isMobile ? 'left' : 'right' },
    fieldErrorText: { fontSize: font(10), fontWeight: '600', marginTop: -4, marginBottom: 6 },
    settingsGeneralError: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: font(11), fontWeight: '600', marginTop: 4 },
    toastWrap: { position: 'absolute', right: isMobile ? 14 : 24, top: isMobile ? 18 : 24, zIndex: 99999, maxWidth: isMobile ? '92%' : 380, minHeight: 48, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 10, ...(Platform.OS === 'web' ? { boxShadow: '0 18px 48px rgba(0,0,0,0.30)', backdropFilter: 'blur(12px)', transitionDuration: '180ms' } : { elevation: 24 }) },
    toastDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
    toastDotText: { color: '#ffffff', fontSize: font(13), fontWeight: '900' },
    toastText: { flex: 1, color: '#ffffff', fontSize: font(11), fontWeight: '700', lineHeight: font(16) },
    drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    drawerBackdrop: { flex: 1 },
    dayDrawerPanel: { width: '100%', maxHeight: '75%', borderTopLeftRadius: 22, borderTopRightRadius: 22, borderWidth: 1, paddingBottom: 20 },

    modalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 20, paddingBottom: 14 },
    modalTitle: { fontSize: font(16), fontWeight: 'bold' },
    modalSubtitle: { fontSize: font(11), marginTop: 2 },

    // Sağ üst kapatma ikonu: kenarlıksız, ince ve zarif — kurumsal ghost-icon görünümü
    modalCloseButton: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: hexToRgba(theme.textMuted, 0.34), ...(Platform.OS === 'web' ? { cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.14)' } : {}) },
    modalCloseText: { fontSize: font(17), fontWeight: '300' },

    // Adım göstergesi: minimalist, yatay ince ilerleme çubukları
    stepIndicatorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
    stepDot: { width: 22, height: 4, borderRadius: 2 },
    stepIndicatorText: { fontSize: font(10), fontWeight: '600', marginLeft: 4 },

    yearPickerBackdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
    yearPickerCard: { width: '100%', maxWidth: 360, borderWidth: 1, borderRadius: 20, padding: 20 },
    yearPickerHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
    yearPickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    yearPickerOption: { width: '31%', borderWidth: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
    yearPickerOptionText: { fontSize: font(14), fontWeight: 'bold' },
    yearPickerCheck: { color: '#ffffff', fontSize: font(12), fontWeight: 'bold' },

    appearanceModal: { width: '100%', maxWidth: 440, maxHeight: '85%', borderWidth: 1, borderRadius: 22, padding: 20 },
    appearanceSectionTitle: { fontSize: font(13), fontWeight: 'bold', marginTop: 12, marginBottom: 8 },
    appearanceOptionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    appearanceThemeOption: { width: '30%', borderWidth: 1, borderRadius: 12, padding: 8, alignItems: 'center', gap: 6 },
    appearanceOptionActive: { borderWidth: 2 },
    themePreview: { width: '100%', height: 48, borderRadius: 6, overflow: 'hidden', flexDirection: 'row' },
    themePreviewSidebar: { width: 12, height: '100%' },
    themePreviewContent: { flex: 1, padding: 4, gap: 4 },
    themePreviewHeader: { height: 8, borderRadius: 2 },
    themePreviewCard: { height: 16, borderRadius: 2 },

    fontScaleRow: { flexDirection: 'row', gap: 8 },
    fontScaleOption: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
    fontScaleOptionActive: { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder },
    fontScaleOptionText: { fontWeight: '600' },
    fontScaleOptionTextActive: { color: '#ffffff', fontWeight: 'bold' },

    subscriptionModal: { width: isMobile ? '96%' : '100%', maxWidth: 540, maxHeight: isMobile ? '94%' : '90%', borderWidth: 1, borderRadius: isMobile ? 18 : 22, overflow: 'hidden' },
    subscriptionModalScroll: { flexGrow: 0, maxHeight: isMobile ? '100%' : 460, width: '100%', ...(Platform.OS === 'web' ? { scrollbarWidth: 'thin', scrollbarColor: 'rgba(174,183,194,0.48) transparent' } : {}) },
    subscriptionModalContent: { padding: isMobile ? 14 : 20, paddingTop: 4, paddingBottom: 24, gap: 16 },

    formSection: { gap: 10 },
    formSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    formSectionTitle: { fontSize: font(13), fontWeight: 'bold' },
    formSectionDescription: { fontSize: font(10) },
    formSectionAction: { fontSize: font(11), fontWeight: 'bold' },

    removableOptionWrapper: { position: 'relative', minWidth: 0, maxWidth: isMobile ? '100%' : 220, flexGrow: 1, flexBasis: isMobile ? '47%' : 150, flexShrink: 1 },
    removableOptionGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 10, paddingTop: 4, paddingBottom: 4, paddingRight: 2, overflow: 'hidden' },

    // Şablon çipleri: artık düz/nötr taban, sol tarafta küçük renk noktası ile marka rengi korunur
    templateOption: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 10, paddingLeft: 14, paddingRight: 46, paddingVertical: 11, minHeight: 44, minWidth: 0, maxWidth: '100%', flexShrink: 1 },
    templateOptionText: { flex: 1, minWidth: 0, paddingRight: 4, fontSize: font(12), fontWeight: '600' },
    templateDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },

    removeOptionButton: {
      position: 'absolute', top: 7, right: 7, width: 28, height: 28, borderRadius: 9,
      backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.inputBg, 0.90) : theme.inputBg,
      borderWidth: 1, borderColor: hexToRgba(theme.textMuted, 0.34),
      alignItems: 'center', justifyContent: 'center', zIndex: 5, opacity: 1,
      ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(0,0,0,0.16)', cursor: 'pointer' } : {})
    },
    removeOptionButtonHover: {
      backgroundColor: hexToRgba(theme.danger, 0.12), borderColor: hexToRgba(theme.danger, 0.62),
      ...(Platform.OS === 'web' ? { boxShadow: `0 5px 15px ${hexToRgba(theme.danger, 0.13)}` } : {})
    },
    removeOptionButtonPressed: { opacity: 0.78, transform: [{ scale: 0.92 }] },

    inlineForm: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 10, marginTop: 4 },
    inlineInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    inlineSaveButton: { marginTop: 4 },
    inlineAddButton: { paddingHorizontal: 16 },
    flexInput: { flex: 1 },

    wrappedOptionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    compactOptionButton: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
    compactOptionButtonActive: { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder },
    compactOptionText: { fontSize: font(11), fontWeight: '600' },
    compactOptionTextActive: { color: theme.accent, fontWeight: 'bold' },

    notificationChannelBlock: { marginTop: 16 },
    notificationChannelLabel: { marginBottom: 10 },
    notificationEmailField: { marginTop: 12, gap: 6 },
    notificationHintBox: { marginTop: 12, borderWidth: 1, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
    notificationHintIcon: { width: 20, height: 20, borderRadius: 10, textAlign: 'center', fontSize: font(11), fontWeight: 'bold', lineHeight: font(20) },
    notificationHintText: { flex: 1, fontSize: font(10), lineHeight: font(15) },
    flexOptionButton: { flex: 1, alignItems: 'center' },

    twoColumnRow: { flexDirection: 'row', gap: 12 },
    singleColumnRow: { flexDirection: 'column' },
    formColumn: { flex: 1, gap: 4 },

    inputLabel: { fontSize: font(11), fontWeight: '600' },
    textInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: font(13), ...(Platform.OS === 'web' ? { outlineStyle: 'none', transitionProperty: 'border-color, box-shadow, background-color', transitionDuration: '160ms' } : {}) },
    numericInputFocused: { borderColor: theme.activeButtonBorder, borderWidth: 1.5, ...(Platform.OS === 'web' ? { boxShadow: `0 0 0 3px ${hexToRgba(theme.activeButton, 0.16)}` } : {}) },

    currencyOptionRow: { flexDirection: 'row', gap: 6 },
    periodOptionRow: { flexDirection: 'row', gap: 8 },
    periodOption: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
    periodOptionActive: { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder },
    periodOptionText: { fontSize: font(12), fontWeight: '600' },
    periodOptionTextActive: { color: theme.accent, fontWeight: 'bold' },

    projectionFieldCard: { borderWidth: 1, borderRadius: 12, padding: 12, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: 12, width: '100%', minWidth: 0, overflow: 'hidden' },
    projectionFieldCopy: { flex: 1, minWidth: 0 },
    projectionRateInputWrap: { width: isMobile ? '100%' : 128, maxWidth: '100%', flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0, alignSelf: isMobile ? 'stretch' : 'center' },
    projectionRateInput: { flex: 1, minWidth: 0, width: '100%', textAlign: 'center' },
    projectionPercent: { fontSize: font(13), fontWeight: 'bold' },

    increasePeriodCard: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 10, width: '100%', minWidth: 0 },
    increasePeriodCopy: { minWidth: 0 },
    increasePeriodOptions: { flexDirection: isMobile ? 'column' : 'row', gap: 8, width: '100%' },
    increasePeriodOption: { flex: 1, minWidth: 0, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
    increasePeriodOptionActive: { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder },
    increasePeriodOptionTitle: { fontSize: font(11), fontWeight: '700', marginBottom: 3 },
    increasePeriodOptionHint: { fontSize: font(9), lineHeight: font(13) },

    paymentMethodOption: { width: '100%', borderWidth: 1, borderRadius: 10, paddingLeft: 14, paddingRight: 46, paddingVertical: 11, minHeight: 44, minWidth: 0, maxWidth: '100%', flexShrink: 1 },
    paymentMethodOptionActive: { backgroundColor: theme.activeButton, borderColor: theme.activeButtonBorder },
    paymentMethodOptionText: { fontSize: font(12), fontWeight: '600' },

    // Kategori çipleri: renkli dolgu yerine nötr taban + küçük kategori rengi noktası, seçilince mavi vurgu
    categoryOption: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
    categoryOptionText: { fontSize: font(11), fontWeight: '600' },
    categoryDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },

    creditScheduleCard: { borderWidth: 1, borderRadius: 14, padding: isMobile ? 12 : 14, gap: 12, width: '100%', minWidth: 0 },
    creditScheduleHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    creditScheduleDescription: { fontSize: font(10), lineHeight: font(15), marginTop: 3 },
    creditScheduleBadge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, flexShrink: 0 },
    creditScheduleBadgeText: { fontSize: font(10), fontWeight: '800' },
    creditScheduleFields: { flexDirection: isMobile ? 'column' : 'row', gap: 10, width: '100%' },
    creditInstallmentField: { flex: 1, minWidth: 0, gap: 4 },
    creditStartDateField: { flex: 1.35, minWidth: 0, gap: 4 },
    creditStartDateRow: { flexDirection: 'row', gap: 8, width: '100%' },
    creditDateInput: { flex: 1, minWidth: 0 },
    creditEndInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
    creditEndInfoIcon: { fontSize: font(16), fontWeight: '900', width: 20, textAlign: 'center' },
    creditEndInfoTitle: { fontSize: font(11), fontWeight: '800', marginBottom: 2 },
    creditEndInfoText: { fontSize: font(10), lineHeight: font(15) },
    creditScheduleHint: { fontSize: font(10), lineHeight: font(15) },

    dateInputRow: { flexDirection: isMobile ? 'column' : 'row', gap: 10 },
    dateInputField: { flex: 1, gap: 4 },
    dateInputYearField: { flex: 1.3 },
    helperText: { fontSize: font(10), marginTop: 4 },

    modalFooter: { flexDirection: 'row', gap: 10, padding: isMobile ? 14 : 20, borderTopWidth: 1 },
    modalCancelButton: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', ...(Platform.OS === 'web' ? { cursor: 'pointer', transitionDuration: '180ms' } : {}) },
    modalCancelButtonText: { fontSize: font(13), fontWeight: 'bold' },
    modalSaveButton: { flex: 1, backgroundColor: theme.activeButton, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', ...(Platform.OS === 'web' ? { cursor: 'pointer', transitionDuration: '180ms' } : {}) },
    modalSaveButtonText: { color: '#ffffff', fontSize: font(13), fontWeight: 'bold' },

    primaryButton: { backgroundColor: theme.activeButton, borderRadius: 10, paddingVertical: 11, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
    primaryButtonText: { color: '#ffffff', fontSize: font(13), fontWeight: 'bold' },
    secondaryButton: { borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center' },
    secondaryButtonText: { fontSize: font(12), fontWeight: 'bold' },

    warningOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.68)', alignItems: 'center', justifyContent: 'center', padding: 20, ...(Platform.OS === 'web' ? { backdropFilter: 'blur(8px)' } : {}) },
    confirmBackdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
    warningCard: { width: '100%', maxWidth: isMobile ? 390 : 420, borderWidth: 1, borderRadius: 24, padding: isMobile ? 22 : 28, alignItems: 'center', ...(Platform.OS === 'web' ? { boxShadow: '0 24px 80px rgba(0,0,0,0.40)' } : {}) },
    warningIconBox: { width: 58, height: 58, borderRadius: 17, borderWidth: 1.25, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
    warningTriangle: { width: 0, height: 0, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 30, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#fbbf24', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    warningBang: { position: 'absolute', top: 8, left: -4, width: 8, color: '#111827', fontSize: font(18), lineHeight: font(20), fontWeight: '900', textAlign: 'center' },
    warningTitle: { fontSize: font(17), fontWeight: '800', marginBottom: 8, textAlign: 'center' },
    warningMessage: { fontSize: font(12), lineHeight: font(18), textAlign: 'center', marginBottom: 8 },
    warningHint: { fontSize: font(11), lineHeight: font(16), textAlign: 'center', marginBottom: 22 },
    warningButton: { width: '100%', backgroundColor: theme.activeButton, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', ...(Platform.OS === 'web' ? { cursor: 'pointer', transitionDuration: '180ms' } : {}) },
    premiumButtonHover: { opacity: 0.92, transform: [{ translateY: -1 }], ...(Platform.OS === 'web' ? { boxShadow: '0 10px 26px rgba(105,101,232,0.28)' } : {}) },
    successIconBox: { backgroundColor: 'rgba(52,211,153,0.14)', borderColor: '#34d399' },
    successCheck: { color: '#34d399', fontSize: font(30), fontWeight: '900', lineHeight: font(34) },
    warningButtonText: { color: '#ffffff', fontSize: font(13), fontWeight: 'bold' },
    confirmationCard: { maxWidth: 420 },
    confirmationMessage: { lineHeight: font(18), marginBottom: 22 },
    confirmationActions: { width: '100%', flexDirection: isMobile ? 'column-reverse' : 'row', gap: 10 },
    confirmationSecondaryButton: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    confirmationSecondaryText: { fontSize: font(13), fontWeight: '700' },
    confirmationPrimaryButton: { flex: 1, backgroundColor: theme.activeButton, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    confirmationPrimaryText: { color: '#ffffff', fontSize: font(13), fontWeight: '700' }
  });
}
