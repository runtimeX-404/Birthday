import java.sql.*;
import java.util.Scanner;

public class LibraryJDBC {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String url = "jdbc:oracle:thin:@localhost:1521/XEPDB1";
        String user = "SYSTEM";
        String password = "25BDE0150";

        try {
            Connection con =
                DriverManager.getConnection(url, user, password);

            System.out.println("Oracle Connected Successfully!");

            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery(
                "SELECT Book_id, Title, Publisher_name FROM BOOK");

            while (rs.next()) {
                System.out.println(
                    rs.getString("Book_id") + " " +
                    rs.getString("Title") + " " +
                    rs.getString("Publisher_name"));
            }

            System.out.print("Enter Book ID: ");
            String id = sc.nextLine();

            PreparedStatement ps = con.prepareStatement(
                "SELECT * FROM BOOK WHERE Book_id = ?");

            ps.setString(1, id);
            ResultSet r = ps.executeQuery();

            while (r.next()) {
                System.out.println("Book ID: " +
                    r.getString("Book_id"));
                System.out.println("Title: " +
                    r.getString("Title"));
                System.out.println("Publisher: " +
                    r.getString("Publisher_name"));
            }

            // Display all borrowers
            System.out.println("\n--- ALL BORROWERS ---");

            Statement borrowerSt = con.createStatement();

            ResultSet borrowerRs = borrowerSt.executeQuery(
                "SELECT Card_no, Name, Phone FROM BORROWER"
            );

            while (borrowerRs.next()) {
                System.out.println(
                    "Card No: " + borrowerRs.getString("Card_no")
                    + " | Name: " + borrowerRs.getString("Name")
                    + " | Phone: " + borrowerRs.getString("Phone")
                );
            }

            borrowerRs.close();
            borrowerSt.close();

            con.close();
            sc.close();
        }
        catch (Exception e) {
            System.out.println("Connection Error: " + e.getMessage());
        }
    }
}
/*/steps to run 
    cd "C:\Users\ashhu\OneDrive\Desktop\assessment 7"
    javac -cp "C:\Users\ashhu\OneDrive\Desktop\assessment 7\ojdbc11.jar"
    java -cp ".;lib\ojdbc11.jar" LibraryJDBC /**/