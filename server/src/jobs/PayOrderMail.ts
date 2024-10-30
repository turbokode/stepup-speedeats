import { sendMail } from '../services/mail';

interface PayOrderMailProps {
  email: string;
  name: string;
  price: string;
  items: string;
  reference: string
}
class PayOrderMail implements IJob {
  key: string = 'PayOrderMail';
  async handle(data: any) {
    const { email, items, name, price, reference } = data.data as PayOrderMailProps;

    await sendMail({
      to: `${name} <${email}>`,
      subject: 'Pagamento recebido',
      template: 'makePayment',
      context: {
        name,
        price,
        items,
        reference
      }
    });
    console.log(' PayOrderMail Queue executed');
  }
}

export default new PayOrderMail();
