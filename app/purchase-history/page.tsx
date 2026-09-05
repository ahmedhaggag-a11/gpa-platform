"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Receipt,
  Search,
  Download,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
} from "lucide-react";
import { getEnrolledCourses } from "@/api/user";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Reusable Components
interface LoadingCardProps {
  message: string;
}

const LoadingCard = ({ message }: LoadingCardProps) => (
  <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/30">
    <CardContent className="p-16 text-center">
      <RefreshCw className="w-20 h-20 text-gray-300 mx-auto mb-6 animate-spin" />
      <h3 className="text-2xl font-bold text-gray-900 mb-3">جاري التحميل...</h3>
      <p className="text-xl text-gray-600">{message}</p>
    </CardContent>
  </Card>
);

interface EmptyStateCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

const EmptyStateCard = ({
  icon,
  title,
  description,
  showButton = false,
  buttonText,
  onButtonClick,
}: EmptyStateCardProps) => (
  <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/30">
    <CardContent className="p-16 text-center">
      {icon}
      <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="md:text-xl text-gray-600 mb-8">{description}</p>
      {showButton && (
        <Button
          className="h-12 px-8 text-lg font-semibold"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      )}
    </CardContent>
  </Card>
);

interface CourseItemProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    price: number;
    image: string;
  };
  index: number;
}

const CourseItem = ({ course, index }: CourseItemProps) => (
  <div
    key={index}
    className="flex items-center gap-6 flex-row-reverse p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl"
  >
    <img
      src={course.image || "/placeholder.svg"}
      alt={course.title}
      className="w-20 h-16 object-cover rounded-lg"
    />
    <div className="flex-1">
      <h4 className="font-bold md:text-lg text-sm mb-1 text-gray-900">{course.title}</h4>
      <p className="md:text-base text-xs text-gray-600">{course.instructor}</p>
    </div>
    <div className="text-right">
      <p className="font-bold text-xl text-primary">${course.price}</p>
    </div>
  </div>
);

interface PurchaseCardProps {
  purchase: {
    id: string;
    date: string;
    courses: Array<{
      id: string;
      title: string;
      instructor: string;
      price: number;
      image: string;
    }>;
    total: number;
    status: string;
    paymentMethod: string;
    transactionId: string;
  };
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  bgColorClass?: string;
}

const PurchaseCard = ({
  purchase,
  getStatusIcon,
  getStatusColor,
  getStatusText,
  bgColorClass = "bg-gradient-to-br from-white to-blue-50/30",
}: PurchaseCardProps) => {
  const router = useRouter();

  return (
    <Card
      key={purchase.id}
      className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${bgColorClass}`}
    >
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Purchase Info */}
          <div className="flex-1">
            <div className="flex items-center flex-row-reverse justify-between mb-6">
              <div>
                <h3 className="md:text-2xl font-bold text-lg mb-2 text-gray-900">
                  #{purchase.id} طلب رقم
                </h3>
                <div className="flex items-center gap-6 text-base text-gray-600">
                  <div className="flex items-center flex-row-reverse gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="md:text-base text-sm">
                      {new Date(purchase.date).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                  <div className="flex items-center flex-row-reverse gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="md:text-base text-sm">
                      {purchase.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  className={`${getStatusColor(
                    purchase.status
                  )} border text-sm md:text-base px-4 py-2`}
                >
                  <div className="flex items-center flex-row-reverse gap-2">
                    {getStatusIcon(purchase.status)}
                    <span className="font-semibold">
                      {getStatusText(purchase.status)}
                    </span>
                  </div>
                </Badge>
              </div>
            </div>

            {/* Courses */}
            <div className="space-y-4 mb-6">
              {purchase.courses.map((course, index) => (
                <CourseItem key={index} course={course} index={index} />
              ))}
            </div>

            <div className="flex items-center flex-row-reverse justify-between pt-6 border-t border-gray-200">
              <div className="md:text-base text-sm text-gray-600">
                {purchase.transactionId} رقم المعاملة
              </div>
              <div className="text-right">
                <p className="md:text-base text-sm text-gray-600 mb-1">إجمالي المبلغ</p>
                <p className="text-2xl font-bold text-primary md:text-lg">
                  ${purchase.total}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex lg:flex-col gap-3 lg:w-36">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 lg:flex-none bg-transparent h-12 text-base font-semibold"
              onClick={() => router.push(`/course/${purchase.courses[0]?.id}`)}
            >
              <Eye className="w-5 h-5 ml-2" />
              عرض
            </Button>
            {purchase.status === "failed" && (
              <Button
                size="sm"
                className="flex-1 lg:flex-none h-12 text-base font-semibold"
              >
                <RefreshCw className="w-5 h-5 ml-2" />
                إعادة المحاولة
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PurchaseListProps {
  purchases: Array<{
    id: string;
    date: string;
    courses: Array<{
      id: string;
      title: string;
      instructor: string;
      price: number;
      image: string;
    }>;
    total: number;
    status: string;
    paymentMethod: string;
    transactionId: string;
  }>;
  isLoading: boolean;
  error: any;
  searchQuery: string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  loadingMessage: string;
  emptyTitle: string;
  emptyDescription: string;
  statusFilter?: string;
  bgColorClass?: string;
}

const PurchaseList = ({
  purchases,
  isLoading,
  error,
  searchQuery,
  getStatusIcon,
  getStatusColor,
  getStatusText,
  loadingMessage,
  emptyTitle,
  emptyDescription,
  statusFilter,
  bgColorClass,
}: PurchaseListProps) => {
  const filteredPurchases = statusFilter
    ? purchases.filter((p) => p.status === statusFilter)
    : purchases;

  if (isLoading) {
    return <LoadingCard message={loadingMessage} />;
  }

  if (error) {
    return (
      <EmptyStateCard
        icon={<XCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />}
        title="خطأ في التحميل"
        description="حدث خطأ أثناء تحميل سجل المشتريات"
        showButton
        buttonText="إعادة المحاولة"
        onButtonClick={() => window.location.reload()}
      />
    );
  }

  if (filteredPurchases.length === 0) {
    return (
      <EmptyStateCard
        icon={<Receipt className="w-20 h-20 text-gray-300 mx-auto mb-6" />}
        title={emptyTitle}
        description={emptyDescription}
        showButton={!searchQuery && !statusFilter}
        buttonText="استكشف الدورات"
      />
    );
  }

  return (
    <div className="space-y-8">
      {filteredPurchases.map((purchase) => (
        <PurchaseCard
          key={purchase.id}
          purchase={purchase}
          getStatusIcon={getStatusIcon}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          bgColorClass={bgColorClass}
        />
      ))}
    </div>
  );
};

export default function PurchaseHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const { user } = useAuth();
  const {
    data: enrolledCoursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", "enrolled-courses"],
    queryFn: getEnrolledCourses,
    enabled: !!user,
  });
  // Transform API data to match the expected purchase format
  const purchases = enrolledCoursesData
    ? enrolledCoursesData.map((enrollment: any) => ({
        id: `PUR-${enrollment.id}`,
        date: enrollment.createdAt,
        courses: [
          {
            id: enrollment.course.id,
            title: enrollment.course.titleAr || enrollment.course.title,
            instructor: enrollment.course.teacher.fullName,
            price: enrollment.course.price,
            image: enrollment.course.imageUrl || "/placeholder.svg",
          },
        ],
        total: enrollment.course.price,
        status:
          enrollment.status === "confirmed" ? "completed" : enrollment.status,
        paymentMethod: "كود الخصم", // Default payment method
        transactionId: `TXN-${enrollment.id}`,
      }))
    : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <RefreshCw className="w-5 h-5 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "pending":
        return "قيد الانتظار";
      case "failed":
        return "فشل";
      default:
        return status;
    }
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.courses.some(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      ) || purchase.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || purchase.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    switch (sortBy) {
      case "amount-high":
        return b.total - a.total;
      case "amount-low":
        return a.total - b.total;
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "recent":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const totalSpent = purchases
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.total, 0);
  const totalCourses = purchases
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.courses.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="md:mb-8 mb-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Receipt className="w-10 h-10 text-primary" />
            <h1 className="leading-relaxed md:text-5xl text-2xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              سجل المشتريات
            </h1>
          </div>
          <p className="sm:text-xl text-gray-600 font-medium">
            تتبع مشتريات الدورات وتحميل الإيصالات
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-blue-50/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg text-gray-600 font-medium">
                    إجمالي المبلغ المنفق
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${totalSpent}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-green-50/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-lg text-gray-600 font-medium">
                    الدورات المشتراة
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalCourses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-purple-50/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">
                  <Receipt className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg text-gray-600 font-medium">
                    إجمالي الطلبات
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {purchases.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full sm:h-16 h-full sm:grid-cols-4 grid-cols-2 bg-white shadow-xl rounded-2xl ">
            <TabsTrigger value="all" className="text-lg font-semibold">
              جميع المشتريات
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-lg font-semibold">
              مكتملة
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-lg font-semibold">
              قيد الانتظار
            </TabsTrigger>
            <TabsTrigger value="failed" className="text-lg font-semibold">
              فاشلة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {/* Filters */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-blue-50/30">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-6 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="البحث في المشتريات أو الدورات أو رقم الطلب..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 md:text-lg"
                      />
                    </div>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-full sm:w-52 h-12 text-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="completed">مكتملة</SelectItem>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="failed">فاشلة</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-52 h-12 text-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">الأحدث</SelectItem>
                        <SelectItem value="oldest">الأقدم</SelectItem>
                        <SelectItem value="amount-high">أعلى مبلغ</SelectItem>
                        <SelectItem value="amount-low">أقل مبلغ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase List */}
            <PurchaseList
              purchases={sortedPurchases}
              isLoading={isLoading}
              error={error}
              searchQuery={searchQuery}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              loadingMessage="يتم تحميل سجل المشتريات"
              emptyTitle="لا توجد مشتريات"
              emptyDescription={
                searchQuery
                  ? "جرب تعديل مصطلحات البحث"
                  : "لم تقم بأي مشتريات بعد"
              }
            />
          </TabsContent>

          {/* Other tab contents */}
          <TabsContent value="completed">
            <PurchaseList
              purchases={sortedPurchases}
              isLoading={isLoading}
              error={error}
              searchQuery={searchQuery}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              loadingMessage="يتم تحميل المشتريات المكتملة"
              emptyTitle="لا توجد مشتريات مكتملة"
              emptyDescription="جميع مشترياتك قيد الانتظار أو فاشلة"
              statusFilter="completed"
              bgColorClass="bg-gradient-to-br from-white to-green-50/30"
            />
          </TabsContent>

          <TabsContent value="pending">
            <PurchaseList
              purchases={sortedPurchases}
              isLoading={isLoading}
              error={error}
              searchQuery={searchQuery}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              loadingMessage="يتم تحميل المشتريات قيد الانتظار"
              emptyTitle="لا توجد مشتريات قيد الانتظار"
              emptyDescription="جميع مشترياتك مكتملة أو فاشلة"
              statusFilter="pending"
              bgColorClass="bg-gradient-to-br from-white to-yellow-50/30"
            />
          </TabsContent>

          <TabsContent value="failed">
            <PurchaseList
              purchases={sortedPurchases}
              isLoading={isLoading}
              error={error}
              searchQuery={searchQuery}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              loadingMessage="يتم تحميل المشتريات الفاشلة"
              emptyTitle="لا توجد مشتريات فاشلة"
              emptyDescription="جميع مشترياتك تمت بنجاح!"
              statusFilter="failed"
              bgColorClass="bg-gradient-to-br from-white to-red-50/30"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
