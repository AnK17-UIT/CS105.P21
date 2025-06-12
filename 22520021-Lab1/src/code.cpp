#include <iostream>
#include <cmath>
#include <vector>
#include <algorithm>

using namespace std;

void solve() {
    int n;
    cin >> n;

    if (n == 0)
    {
        cout << "0\n";
        return;
    }

    vector<int> a(n);

    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    sort(a.begin(), a.end());

    if (n == 2)
    {
        cout << (a[1] - a[0]) * 2 << '\n';
        return;
    }
    // else
    // {
    //     cout << (a[n - 1] - a[0]) + (a[n - 2] - a[1]) << '\n';
    // }

    int maxWeight = max((a[n - 1] - a[0]) + (a[n - 2] - a[1]), (a[n - 1] - a[1]) + (a[n - 2] - a[0]));  
    cout << maxWeight << '\n';
}

int main() {
    // ios::sync_with_stdio(false);
    // cin.tie(nullptr);

    int test;
    cin >> test;
    
    while (test--) {
        solve();
    }
    
    return 0;
}
