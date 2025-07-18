import { X, Calendar, TrendingUp, TrendingDown, Building2, AlertTriangle, Users, FileText, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { IPO } from '../data/mockData';
import { useRealtimeSubscription } from '../hooks/useIPOData';

interface IPODetailsModalProps {
  ipo: IPO | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IPODetailsModal({ ipo, isOpen, onClose }: IPODetailsModalProps) {
  // Get real-time subscription updates for open IPOs
  const { subscriptionData, loading: subscriptionLoading, lastUpdated } = useRealtimeSubscription(
    ipo?.status === 'open' ? ipo.id : null
  );

  if (!ipo) return null;

  // Use real-time data if available, otherwise fall back to static data
  const currentSubscriptionStatus = subscriptionData?.subscriptionStatus || ipo.subscriptionStatus;

  const getStatusColor = (status: IPO['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'listed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000) {
      return `₹${(amount / 10000).toFixed(1)}L Cr`;
    }
    return `₹${amount.toLocaleString()} Cr`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {ipo.companyName}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <Badge className={`${getStatusColor(ipo.status)}`}>
                  {ipo.status.toUpperCase()}
                </Badge>
                <span className="text-gray-600">{ipo.sector} • {ipo.industry}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="risks">Risk Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Price Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{ipo.priceRange.min} - ₹{ipo.priceRange.max}
                  </p>
                  <p className="text-sm text-gray-600">Lot Size: {ipo.lotSize} shares</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Issue Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(ipo.issueSize)}</p>
                  <p className="text-sm text-gray-600">Total offering</p>
                </CardContent>
              </Card>

              {ipo.gmp && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Grey Market Premium</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-2xl font-bold flex items-center gap-2 ${
                      ipo.gmp > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {ipo.gmp > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      ₹{Math.abs(ipo.gmp)}
                    </p>
                    <p className="text-sm text-gray-600">Current premium</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Subscription Status */}
            {currentSubscriptionStatus && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Subscription Status
                      {ipo.status === 'open' && (
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          Live Updates
                        </Badge>
                      )}
                    </div>
                    {ipo.status === 'open' && lastUpdated && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <RefreshCw className={`w-3 h-3 ${subscriptionLoading ? 'animate-spin' : ''}`} />
                        <span>Updated {lastUpdated.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Overall Subscription</span>
                        <span className="text-lg font-bold">{currentSubscriptionStatus.overall}x</span>
                      </div>
                      <Progress value={Math.min(currentSubscriptionStatus.overall * 20, 100)} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Retail Individual Investors</p>
                        <p className="text-xl font-bold text-gray-900">{currentSubscriptionStatus.retail}x</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Qualified Institutional Buyers</p>
                        <p className="text-xl font-bold text-gray-900">{currentSubscriptionStatus.qib}x</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Non-Institutional Investors</p>
                        <p className="text-xl font-bold text-gray-900">{currentSubscriptionStatus.nii}x</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Company About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  About the Company
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{ipo.companyDetails.about}</p>
              </CardContent>
            </Card>

            {/* Lead Managers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Issue Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Lead Managers</h4>
                  <div className="flex flex-wrap gap-2">
                    {ipo.leadManagers.map((manager, index) => (
                      <Badge key={index} variant="outline">{manager}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Registrar</h4>
                  <p className="text-gray-700">{ipo.registrar}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(ipo.companyDetails.revenue)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${
                    ipo.companyDetails.profit > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(ipo.companyDetails.profit)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">ROE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${
                    ipo.companyDetails.roe > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {ipo.companyDetails.roe}%
                  </p>
                </CardContent>
              </Card>

              {ipo.companyDetails.pe && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">P/E Ratio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900">{ipo.companyDetails.pe}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Book Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">₹{ipo.companyDetails.bookValue}</p>
                </CardContent>
              </Card>

              {ipo.companyDetails.marketCap && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Market Cap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(ipo.companyDetails.marketCap)}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Bidding Opens</span>
                    <span className="text-gray-700">{formatDate(ipo.keyDates.bidding.start)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Bidding Closes</span>
                    <span className="text-gray-700">{formatDate(ipo.keyDates.bidding.end)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Allotment Date</span>
                    <span className="text-gray-700">{formatDate(ipo.keyDates.allotment)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Refund Date</span>
                    <span className="text-gray-700">{formatDate(ipo.keyDates.refund)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Listing Date</span>
                    <span className="text-gray-700">{formatDate(ipo.keyDates.listing)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ipo.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{risk}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}