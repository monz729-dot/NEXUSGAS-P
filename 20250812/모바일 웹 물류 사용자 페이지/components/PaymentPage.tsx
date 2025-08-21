import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, CreditCard, Copy, CheckCircle, Clock, Phone, Mail, AlertTriangle, Building2, User, FileText, Info } from 'lucide-react';
import { User as UserType } from '../types';

interface PaymentPageProps {
  user: UserType | null;
  onNavigate: (page: string, options?: { orderId?: string }) => void;
  orderId: string;
}

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankCode: string;
}

interface OrderPaymentInfo {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  currency: 'THB';
  dueDate: string;
  issuedDate: string;
  paymentStatus: 'pending' | 'confirmed' | 'completed';
  depositorName?: string;
  items: Array<{
    name: string;
    quantity: number;
    amount: number;
  }>;
  fees: {
    shippingFee: number;
    localDeliveryFee: number;
    repackingFee?: number;
    handlingFee: number;
    insuranceFee: number;
    customsFee: number;
    tax: number;
  };
}

export function PaymentPage({ user, onNavigate, orderId }: PaymentPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<OrderPaymentInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string>('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // YCS 무통장 입금 계좌 정보
  const bankAccounts: BankAccount[] = [
    {
      bankName: '국민은행',
      accountNumber: '123456-78-901234',
      accountHolder: '(주)YCS물류',
      bankCode: '004'
    },
    {
      bankName: '신한은행',
      accountNumber: '987-654-321098',
      accountHolder: '(주)YCS물류',
      bankCode: '088'
    },
    {
      bankName: '우리은행',
      accountNumber: '1005-123-456789',
      accountHolder: '(주)YCS물류',
      bankCode: '020'
    }
  ];

  useEffect(() => {
    // 주문 결제 정보 로딩 (데모 데이터)
    setTimeout(() => {
      const mockPaymentInfo: OrderPaymentInfo = {
        orderNumber: 'YCS-240115-001',
        customerName: '김철수',
        customerPhone: '010-1234-5678',
        totalAmount: 151975,
        currency: 'THB',
        dueDate: '2024-01-25',
        issuedDate: '2024-01-19',
        paymentStatus: 'pending',
        depositorName: '김철수',
        items: [
          { name: '빼빼로 초콜릿', quantity: 10, amount: 25000 },
          { name: '초콜릿 과자', quantity: 5, amount: 12000 }
        ],
        fees: {
          shippingFee: 85000,
          localDeliveryFee: 25000,
          repackingFee: 15000,
          handlingFee: 10000,
          insuranceFee: 2000,
          customsFee: 5000,
          tax: 9975
        }
      };
      
      setPaymentInfo(mockPaymentInfo);
      setIsLoading(false);
    }, 1000);
  }, [orderId]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    });
  };

  const handlePaymentConfirm = () => {
    setPaymentConfirmed(true);
    setTimeout(() => {
      alert(`입금 신고가 완료되었습니다.\n주문번호: ${paymentInfo?.orderNumber}\n관리자 확인 후 배송이 시작됩니다.`);
      onNavigate('order-history');
    }, 1500);
  };

  if (isLoading || !paymentInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-600">결제 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('order-detail', { orderId })}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          주문상세로
        </Button>
        <div>
          <h1 className="text-xl text-blue-900">무통장 입금</h1>
          <p className="text-sm text-blue-600">{paymentInfo.orderNumber} - 입금 안내</p>
        </div>
      </div>

      {/* 결제 확인 완료 메시지 */}
      {paymentConfirmed && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            입금 신고가 완료되었습니다. 관리자 확인 후 배송이 시작됩니다.
          </AlertDescription>
        </Alert>
      )}

      {/* 입금 안내 */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="space-y-2">
            <p className="font-medium">입금 시 주의사항</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>입금자명은 주문자명과 동일해야 합니다: <strong>{paymentInfo.customerName}</strong></li>
              <li>입금 마감일: <strong>{paymentInfo.dueDate}</strong></li>
              <li>정확한 금액을 입금해주세요: <strong>{paymentInfo.totalAmount.toLocaleString()} {paymentInfo.currency}</strong></li>
              <li>입금 후 반드시 "입금 완료" 버튼을 눌러주세요</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* 결제 금액 정보 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            결제 금액 상세
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 총 결제금액 강조 */}
          <div className="p-4 bg-blue-100/50 rounded-lg border border-blue-200/50">
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-medium">총 결제금액</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-600">
                  {paymentInfo.totalAmount.toLocaleString()}
                </span>
                <span className="text-lg font-medium text-blue-600 ml-2">{paymentInfo.currency}</span>
              </div>
            </div>
          </div>

          {/* 비용 상세 */}
          <div className="space-y-3">
            <h4 className="font-medium text-blue-900">비용 상세</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>기본 배송비</span>
                <span>{paymentInfo.fees.shippingFee.toLocaleString()} {paymentInfo.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>현지 배송비</span>
                <span>{paymentInfo.fees.localDeliveryFee.toLocaleString()} {paymentInfo.currency}</span>
              </div>
              {paymentInfo.fees.repackingFee && (
                <div className="flex justify-between text-sm">
                  <span>리패킹 비용</span>
                  <span>{paymentInfo.fees.repackingFee.toLocaleString()} {paymentInfo.currency}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>취급 수수료</span>
                <span>{paymentInfo.fees.handlingFee.toLocaleString()} {paymentInfo.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>보험료</span>
                <span>{paymentInfo.fees.insuranceFee.toLocaleString()} {paymentInfo.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>통관 수수료</span>
                <span>{paymentInfo.fees.customsFee.toLocaleString()} {paymentInfo.currency}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-medium">
                <span>TAX 7%</span>
                <span>{paymentInfo.fees.tax.toLocaleString()} {paymentInfo.currency}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 무통장 입금 계좌 정보 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            입금 계좌 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {bankAccounts.map((account, index) => (
              <div key={index} className="p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <h4 className="font-medium text-blue-900">{account.bankName}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    은행코드: {account.bankCode}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {/* 계좌번호 */}
                  <div>
                    <label className="text-sm text-blue-700 block mb-1">계좌번호</label>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-blue-900 flex-1">
                        {account.accountNumber}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(account.accountNumber, `account-${index}`)}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        {copiedField === `account-${index}` ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* 예금주 */}
                  <div>
                    <label className="text-sm text-blue-700 block mb-1">예금주</label>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-900 flex-1">
                        {account.accountHolder}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(account.accountHolder, `holder-${index}`)}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        {copiedField === `holder-${index}` ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 입금자 정보 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <User className="h-5 w-5" />
            입금자 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-blue-700 block mb-1">입금자명 (필수)</label>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="font-medium text-yellow-900">{paymentInfo.depositorName || paymentInfo.customerName}</span>
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                반드시 위 이름으로 입금해주세요
              </p>
            </div>
            <div>
              <label className="text-sm text-blue-700 block mb-1">연락처</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-700">{paymentInfo.customerPhone}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-blue-700 block mb-1">입금 금액</label>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 text-lg">
                  {paymentInfo.totalAmount.toLocaleString()} {paymentInfo.currency}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(paymentInfo.totalAmount.toString(), 'amount')}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  {copiedField === 'amount' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 입금 후 안내 */}
      <Card className="shadow-blue border-green-100 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center gap-2">
            <Info className="h-5 w-5" />
            입금 후 처리 절차
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-green-900">무통장 입금</p>
                <p className="text-sm text-green-700">위 계좌로 정확한 금액을 입금해주세요</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-green-900">입금 완료 신고</p>
                <p className="text-sm text-green-700">아래 "입금 완료" 버튼을 눌러 입금을 신고해주세요</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-green-900">관리자 확인</p>
                <p className="text-sm text-green-700">1-2시간 내 입금 확인 후 배송이 시작됩니다</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 고객센터 연락처 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            문의 연락처
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700">고객센터</p>
                <p className="font-medium">02-1234-5678</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700">이메일</p>
                <p className="font-medium">support@ycs.co.kr</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            입금 관련 문의사항이 있으시면 언제든 연락주세요 (평일 09:00-18:00)
          </p>
        </CardContent>
      </Card>

      {/* 하단 버튼 */}
      <div className="flex gap-4 pb-20">
        <Button 
          variant="outline" 
          onClick={() => onNavigate('order-detail', { orderId })}
          className="flex-1 h-14"
        >
          주문상세로
        </Button>
        <Button 
          onClick={handlePaymentConfirm}
          disabled={paymentConfirmed}
          className="flex-1 h-14 bg-green-600 hover:bg-green-700"
        >
          {paymentConfirmed ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              신고완료
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              입금 완료
            </>
          )}
        </Button>
      </div>
    </div>
  );
}