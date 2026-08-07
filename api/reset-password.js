const admin = require('firebase-admin');
const { Resend } = require('resend');
const crypto = require('crypto');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const resend = new Resend(process.env.RESEND_API_KEY);

function createTemporaryPassword() {
  const raw = crypto.randomBytes(12).toString('base64url');
  return `Cb!${raw.slice(0, 12)}7a`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Geçerli Bir E-posta Adresi Giriniz.' });
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    const temporaryPassword = createTemporaryPassword();

    // Kullanıcının Firebase Authentication şifresini sunucu tarafında değiştirir.
    await admin.auth().updateUser(user.uid, { password: temporaryPassword });

    const fromAddress = process.env.PASSWORD_RESET_FROM;
    if (!fromAddress) throw new Error('PASSWORD_RESET_FROM ortam değişkeni tanımlı değil.');

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: 'Cebin PRO - Yeni Geçici Şifreniz',
      html: `
        <div style="font-family:Arial,sans-serif;background:#171b2b;padding:32px;color:#eef2f7">
          <div style="max-width:560px;margin:0 auto;background:#303746;border:1px solid #566071;border-radius:20px;padding:28px">
            <h2 style="margin:0 0 12px;color:#ffffff">Cebin <span style="color:#9b98ff">PRO</span></h2>
            <p style="color:#c5cbd6;line-height:1.6">Şifre yenileme talebiniz tamamlandı.</p>
            <p style="color:#c5cbd6;line-height:1.6">Yeni geçici şifreniz:</p>
            <div style="background:#252b38;border:1px solid #6965e8;border-radius:12px;padding:16px;text-align:center;font-size:20px;font-weight:700;letter-spacing:1px;color:#ffffff">${temporaryPassword}</div>
            <p style="color:#aeb7c2;line-height:1.6;margin-top:18px">Bu şifre ile giriş yaptıktan sonra Kullanıcı Ayarları bölümünden kendinize yeni bir şifre belirlemenizi öneririz.</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(502).json({ message: 'E-posta Gönderilemedi. Lütfen Tekrar Deneyiniz.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('reset-password error:', error);

    // Hesap var/yok bilgisini dışarı sızdırmamak için genel yanıt kullanıyoruz.
    if (error?.code === 'auth/user-not-found') {
      return res.status(404).json({ message: 'Bu E-posta Adresiyle Kayıtlı Bir Hesap Bulunamadı.' });
    }

    return res.status(500).json({ message: 'Yeni Şifre Oluşturulamadı. Lütfen Tekrar Deneyiniz.' });
  }
};
