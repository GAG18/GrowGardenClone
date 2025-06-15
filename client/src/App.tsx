import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import TradeAds from "@/pages/trade-ads";
import CreateTradeAd from "@/pages/create-trade-ad";
import Admin from "@/pages/admin";
import MiddleMan from "@/pages/middleman";
import Stocks from "@/pages/stocks";
import AuthCallback from "@/pages/auth-callback";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trade-ads" component={TradeAds} />
      <Route path="/trade-ads/create" component={CreateTradeAd} />
      <Route path="/create-trade-ad" component={CreateTradeAd} />
      <Route path="/admin" component={Admin} />
      <Route path="/middleman" component={MiddleMan} />
      <Route path="/stocks" component={Stocks} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
